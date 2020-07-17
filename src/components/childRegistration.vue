<template>
  <validation-observer ref="form">
    <v-form>
      <v-card
        class="mb-6"
        v-for="(child, index) in childData.children"
        :key="index"
        outlined
        elevation="2"
      >
        <v-container>
          <v-row>
            <v-col cols="6" md="6">
              <v-text-field-with-validation
                rules="required"
                label="First Name"
                v-bind:value="child.firstName"
                v-on:input="updateChild(index, {firstName: $event})"
                autofocus
              />
            </v-col>
            <v-col cols="6" md="6">
              <v-text-field-with-validation
                rules="required"
                label="Last Name"
                v-bind:value="child.lastName"
                v-on:input="updateChild(index, {lastName: $event})"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-menu
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field-with-validation
                    v-bind:value="child.formattedDateOfBirth"
                    v-on:input="setDateOfBirth(index, $event)"
                    label="Date of Birth"
                    hint="MM/DD/YYYY"
                    persistent-hint
                    v-facade="dateOfBirthMask"
                    :rules="{ required: true, regex: dateOfBirthRegex }"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-bind:value="child.isoDateOfBirth"
                  v-on:input="setISODateOfBirth(index, $event)"
                  no-title
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="6" md="3">
              <v-select-with-validation
                v-bind:value="child.gender"
                v-on:input="updateChild(index, {gender: $event})"
                :rules="{ required: true, oneOf: genders.map(v => v.value) }"
                :items="genders"
                label="Gender"
                autocomplete="sex"
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-select-with-validation
                v-bind:value="child.grade"
                v-on:input="updateChild(index, {grade: $event})"
                :rules="{ required: true, oneOf: grades.map(v => v.value) }"
                :items="grades"
                label="Grade"
                :hint="'As of September  ' + getCurrentSchoolYear()"
                persistent-hint
              />
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field v-bind:value="child.club" label="Club" disabled></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="child.hasMedical"
                @change="updateChild(index, {hasMedical: $event})"
                label="Child has medical condition/allergies?"
              ></v-checkbox>
            </v-col>
            <v-expand-transition>
              <v-col cols="12" v-if="child.hasMedical">
                <v-textarea-with-validation
                  rules="required"
                  label="Medical conditions"
                  v-bind:value="child.medical"
                  v-on:input="updateChild(index, {medical: $event})"
                />
              </v-col>
            </v-expand-transition>
          </v-row>
        </v-container>
        <v-btn absolute fab bottom small right color="secondary" @click="deleteChild(index)">
          <v-icon>$trash</v-icon>
        </v-btn>
      </v-card>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Vue } from 'vue-property-decorator'

import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextareaWithValidation from '@/components/inputs/vTextareaWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { dateOfBirthISORegex, dateOfBirthMask, dateOfBirthRegex, genders, getCurrentSchoolYear, grades } from '@/const'
import { vxm } from '@/store'

import { ChildUpdate } from '../store/registration'

@Component({
  directives: {
    facade
  },
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VSelectWithValidation,
    VTextareaWithValidation
  }
})
export default class extends Vue {
  $refs!: {
    form: InstanceType<typeof ValidationObserver>
  }

  readonly dateOfBirthMask = dateOfBirthMask
  readonly dateOfBirthRegex = dateOfBirthRegex
  readonly genders = genders
  readonly grades = grades
  readonly getCurrentSchoolYear = getCurrentSchoolYear

  childData = vxm.registration.childRegistrations

  updateChild (index: number, props: ChildUpdate) {
    this.childData.updateChild({ index, props })
  }

  deleteChild (index: number) {
    this.childData.deleteChild({ index })
  }

  setDateOfBirth (index: number, dateString: string) {
    if (dateString === null || dateOfBirthRegex.test(dateString)) {
      let dateOfBirth = null
      if (dateOfBirthRegex.test(dateString)) {
        dateOfBirth = new Date(dateString)
      }
      this.childData.updateChild({ index, props: { dateOfBirth } })
    }
  }

  setISODateOfBirth (index:number, dateString: string) {
    if (dateString === null || dateOfBirthISORegex.test(dateString)) {
      let dateOfBirth = null
      if (dateOfBirthISORegex.test(dateString)) {
        dateOfBirth = new Date(dateString)
      }
      this.childData.updateChild({ index, props: { dateOfBirth } })
    }
  }

  async validate () {
    if (this.childData.isEmpty) {
      return true
    }

    const formValidation = await this.$refs.form.validate()
    return this.childData.isValid && formValidation
  }
}
</script>
