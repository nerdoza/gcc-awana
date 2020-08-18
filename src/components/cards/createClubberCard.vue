<template>
  <v-card tile>
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
                v-facade="dateOfBirthMask"
                :rules="{ required: true, regex: dateOfBirthRegex }"
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
          </v-row>
        </v-container>
      </v-form>
    </validation-observer>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        class="primary mb-2 mr-2"
        @click="tryCreate"
        :disabled="creating || !isValid"
        :loading="creating"
      >
        <v-icon class="mr-2">$addUser</v-icon>Create
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Emit, Ref, Vue, Watch } from 'vue-property-decorator'

import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { clubSelect, dateOfBirthMask, dateOfBirthRegex, firestoreCollections, genderSelect, getAgeAsOfSchoolStart, getClubByGrade, getGradeByAge, gradeSelect } from '@/const'
import firebaseProject from '@/plugins/firebase'

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

  readonly clubSelect = clubSelect
  readonly genderSelect = genderSelect
  readonly gradeSelect = gradeSelect
  readonly dateOfBirthMask = dateOfBirthMask
  readonly dateOfBirthRegex = dateOfBirthRegex

  @Watch('clubber.birthday')
  onBirthdayChange (newValue: string) {
    if (dateOfBirthRegex.test(newValue)) {
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

  get isValid () {
    return this.clubber.firstName !== '' &&
      this.clubber.lastName !== '' &&
      this.clubber.birthday !== '' &&
      this.clubber.gender !== '' &&
      this.clubber.grade !== '' &&
      this.clubber.club !== ''
  }

  async validate () {
    const formValidation = await this.form.validate()
    return this.isValid && formValidation
  }

  async tryCreate () {
    this.creating = true
    if (await this.validate()) {
      const newClubberId = await firebaseProject.addDocument(firestoreCollections.clubbers, this.clubber) as string
      this.create({ uid: newClubberId, clubber: this.clubber as Clubber })
    }
    this.creating = false
  }

  @Emit()
  create (clubber: {uid: string, clubber: Clubber}) {
    return clubber
  }

  @Emit()
  close () {
    return undefined
  }
}
</script>
