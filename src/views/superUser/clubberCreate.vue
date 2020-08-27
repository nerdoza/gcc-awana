<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Create Clubber</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$close</v-icon>
            </v-btn>
          </v-toolbar>
          <validation-observer ref="form">
            <v-form @submit.prevent="trySave">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field-with-validation
                      label="First Name"
                      v-model="clubber.firstName"
                      rules="required"
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field-with-validation
                      label="Last Name"
                      v-model="clubber.lastName"
                      rules="required"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field-with-validation
                      label="Birthday"
                      hint="MM/DD/YYYY"
                      type="tele"
                      v-model="clubber.birthday"
                      v-facade="birthdayMask"
                      :rules="{ required: true, regex: birthdayRegex }"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select-with-validation
                      v-model="clubber.gender"
                      rules="required"
                      :items="genderSelect"
                      label="Gender"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-select-with-validation
                      v-model="clubber.grade"
                      rules="required"
                      :items="gradeSelect"
                      label="Grade"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select-with-validation
                      v-model="clubber.club"
                      rules="required"
                      :items="clubSelect"
                      label="Club"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" v-for="(parent, index) in parents" :key="index">
                    <v-text-field-with-validation
                      label="Parent Phone"
                      type="tele"
                      v-model="parent.number"
                      v-facade="phoneNumberMask"
                      :rules="{ required: index === 0, skipIfEmpty: false, regex: phoneNumberRegex }"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </validation-observer>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="primary mb-2 mr-2"
              @click="createClubber"
              :disabled="creating"
              :loading="creating"
            >
              <v-icon class="mr-2">$addUser</v-icon>Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'

import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { birthdayMask, birthdayRegex, clubSelect, genderSelect, getAgeAsOfSchoolStart, getClubByGrade, getGradeByAge, gradeSelect, phoneNumberMask, phoneNumberRegex } from '@/const'
import { vxm } from '@/store'

@Component({
  directives: {
    facade
  },
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VSelectWithValidation
  }
})
export default class extends Vue {
  @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>

  creating = false
  age = 0

  clubber = {
    firstName: '',
    lastName: '',
    birthday: '',
    gender: '',
    grade: '',
    club: ''
  }

  parents = [{ number: '' }, { number: '' }]

  readonly clubSelect = clubSelect
  readonly genderSelect = genderSelect
  readonly gradeSelect = gradeSelect
  readonly birthdayMask = birthdayMask
  readonly birthdayRegex = birthdayRegex
  readonly phoneNumberMask = phoneNumberMask
  readonly phoneNumberRegex = phoneNumberRegex

  @Watch('clubber.birthday')
  onBirthdayChange (newValue: string) {
    if (birthdayRegex.test(newValue)) {
      this.age = getAgeAsOfSchoolStart(newValue)
      if (this.clubber.grade === '') {
        this.clubber.grade = getGradeByAge(this.age)
      }

      if (this.clubber.club === '' && this.clubber.gender !== '') {
        this.clubber.club = getClubByGrade(this.clubber.grade as Grade, this.age, this.clubber.gender as Gender)
      }
    }
  }

  @Watch('clubber.gender')
  onGenderChanged (newValue: string) {
    if (newValue !== '' && this.clubber.club === '' && this.clubber.grade !== '' && this.clubber.birthday !== '') {
      this.clubber.club = getClubByGrade(this.clubber.grade as Grade, this.age, this.clubber.gender as Gender)
    }
  }

  async validate () {
    return await this.form.validate()
  }

  async createClubber () {
    if (await this.validate()) {
      this.creating = true
      const cid = await vxm.clubbers.createClubberRecord({ clubber: { ...this.clubber, parents: this.parents.map(p => p.number).filter(p => p !== '') } as Clubber })
      this.$router.replace({ name: 'SuperClubberEdit', params: { cid } })
    }
  }

  close () {
    this.$router.go(-1)
  }
}
</script>
