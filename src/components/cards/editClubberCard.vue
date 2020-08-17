<template>
  <v-card tile class="edit-clubber-card">
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Clubber</v-toolbar-title>
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
                v-model="rawClubber.firstName"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field-with-validation
                label="Last Name"
                v-model="rawClubber.lastName"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field-with-validation
                label="Birthday"
                hint="MM/DD/YYYY"
                type="tele"
                v-model="rawClubber.birthday"
                v-facade="dateOfBirthMask"
                :rules="{ required: true, regex: dateOfBirthRegex }"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select-with-validation
                v-model="rawClubber.gender"
                rules="required"
                :items="genderSelect"
                label="Gender"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select-with-validation
                v-model="rawClubber.grade"
                rules="required"
                :items="gradeSelect"
                label="Grade"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select-with-validation
                v-model="rawClubber.club"
                rules="required"
                :items="clubSelect"
                label="Club"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script lang="ts">
import { debounce } from 'ts-debounce'
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { clubSelect, dateOfBirthMask, dateOfBirthRegex, firestoreCollections, genderSelect, gradeSelect } from '@/const'
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
  @Prop() readonly clubber!: {uid: string, clubber: Clubber}

  readonly clubSelect = clubSelect
  readonly genderSelect = genderSelect
  readonly gradeSelect = gradeSelect
  readonly dateOfBirthMask = dateOfBirthMask
  readonly dateOfBirthRegex = dateOfBirthRegex

  rawUid = this.clubber.uid

  rawClubber = {
    firstName: this.clubber.clubber.firstName,
    lastName: this.clubber.clubber.lastName,
    birthday: this.clubber.clubber.birthday,
    gender: this.clubber.clubber.gender,
    grade: this.clubber.clubber.grade,
    club: this.clubber.clubber.club
  }

  readonly debouncedUpdate = debounce(({ uid, clubber }: {uid: string, clubber: Clubber}) => {
    void firebaseProject.setDocument(uid, firestoreCollections.clubbers, clubber)
  }, 500)

  async validate () {
    return await this.form.validate()
  }

  @Watch('clubber', { deep: true, immediate: true })
  async onClubberChanged ({ uid, clubber }: {uid: string, clubber: Clubber}) {
    this.rawUid = uid
    this.rawClubber.firstName = clubber.firstName
    this.rawClubber.lastName = clubber.lastName
    this.rawClubber.birthday = clubber.birthday
    this.rawClubber.gender = clubber.gender
    this.rawClubber.grade = clubber.grade
    this.rawClubber.club = clubber.club
  }

  @Watch('rawClubber', { deep: true })
  async onRawClubberChanged (clubber: Clubber) {
    if (await this.validate()) {
      this.update({ uid: this.rawUid, clubber: { ...clubber } })
      this.debouncedUpdate({ uid: this.rawUid, clubber: { ...clubber } })
    }
  }

  @Emit()
  update (clubber: {uid: string, clubber: Clubber}) {
    return clubber
  }

  @Emit()
  close () {
    return undefined
  }
}
</script>
