<template>
  <validation-observer ref="form">
    <v-form>
      <v-container>
        <v-row v-for="(child, index) in childData.children" :key="index">
          <v-col cols="6" md="6">
            <v-text-field-with-validation
              rules="required"
              label="First Name"
              v-model="child.firstName"
              autofocus
            />
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field-with-validation
              rules="required"
              label="Last Name"
              v-model="child.lastName"
            />
          </v-col>
          <v-col cols="6" md="6">
            <v-menu
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field-with-validation
                  v-bind:value="getFormatedDateOfBirth(child.dateOfBirth)"
                  v-on:input="setFormatedDateOfBirth(index, $event)"
                  label="Date of Birth"
                  hint="MM/DD/YYYY"
                  persistent-hint
                  v-facade="dateOfBirthMask"
                  :rules="{ regex: dateOfBirthRegex }"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-bind:value="getISODateOfBirth(child.dateOfBirth)"
                v-on:input="setISODateOfBirth(index, $event)"
                no-title
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Vue } from 'vue-property-decorator'

import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { dateOfBirthMask, dateOfBirthRegex } from '@/const'
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
  $refs!: {
    form: InstanceType<typeof ValidationObserver>
  }

  readonly dateOfBirthMask = dateOfBirthMask
  readonly dateOfBirthRegex = dateOfBirthRegex

  childData = vxm.registration.childRegistrations

  updateChild (index: number, props: {firstName?: string, lastName?:string, dateOfBirth?:string}) {
    this.childData.updateChild({ index, props: { ...this.childData.children[index], ...props } })
  }

  getFormatedDateOfBirth (dateString: string) {
    if (dateString === '') {
      return ''
    }
    const [year, month, day] = dateString.split('-')
    return `${month}/${day}/${year}`
  }

  getISODateOfBirth (dateString: string) {
    if () {
      return (new Date()).toISOString().substr(0, 10)
    }
    return dateString
  }

  setFormatedDateOfBirth (index: number, dateString: string) {
    if (dateOfBirthRegex.test(dateString)) {
      const [month, day, year] = dateString.split('/')
      const isoDateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      this.setISODateOfBirth(index, isoDateString)
    }
  }

  setISODateOfBirth (index:number, dateString: string) {
    this.childData.updateChild({ index, props: { ...this.childData.children[index], dateOfBirth: dateString } })
  }

  // async validate () {
  //   const formValidation = await this.$refs.form.validate()
  //   return this.user.isValid && formValidation
  // }
}
</script>
