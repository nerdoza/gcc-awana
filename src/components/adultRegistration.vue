<template>
  <validation-observer ref="form">
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="6" md="6">
            <v-text-field-with-validation
              rules="required"
              label="First Name"
              v-model="user.firstName"
            />
          </v-col>
          <v-col cols="6" md="6">
            <v-text-field-with-validation
              rules="required"
              label="Last Name"
              v-model="user.lastName"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field-with-validation
              rules="required"
              label="Street Address"
              v-model="user.streetAddress"
              autocomplete="street-address"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field-with-validation rules="required" label="City" v-model="user.city" />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field-with-validation
              label="Zip"
              :rules="{ required: true, regex: zipCodeRegex }"
              v-facade="zipCodeMask"
              v-model="user.zip"
              autocomplete="postal-code"
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-select-with-validation
              v-model="user.state"
              :items="states"
              rules="required"
              label="State"
              autocomplete="address-level1"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field-with-validation
              rules="required|email"
              v-model="user.email"
              label="E-mail"
              autocomplete="email"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="user.primaryPhone"
              label="Mobile Phone Number"
              autocomplete="tel"
              disabled
            />
          </v-col>
          <v-col cols="6">
            <v-text-field-with-validation
              :rules="{ regex: phoneNumberRegex }"
              v-model="user.altPhone"
              v-facade="phoneNumberMask"
              label="Alt Phone Number"
            />
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
import { phoneNumberMask, phoneNumberRegex, states, zipCodeMask, zipCodeRegex } from '@/const'
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

  readonly zipCodeRegex = zipCodeRegex
  readonly zipCodeMask = zipCodeMask
  readonly phoneNumberRegex = phoneNumberRegex
  readonly phoneNumberMask = phoneNumberMask
  readonly states = states

  user = vxm.registration.adultRegistration

  async validate () {
    const formValidation = await this.$refs.form.validate()
    return this.user.isValid && formValidation
  }
}
</script>
