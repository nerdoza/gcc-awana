<template>
  <validation-observer ref="form">
    <v-form>
      <v-card class="mb-6" outlined elevation="2">
        <v-container>
          <v-row>
            <v-col cols="6" md="6">
              <v-text-field-with-validation
                rules="required"
                label="First Name"
                v-model="adultData.firstName"
                autofocus
              />
            </v-col>
            <v-col cols="6" md="6">
              <v-text-field-with-validation
                rules="required"
                label="Last Name"
                v-model="adultData.lastName"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field-with-validation
                rules="required"
                label="Street Address"
                v-model="adultData.streetAddress"
                autocomplete="street-address"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field-with-validation rules="required" label="City" v-model="adultData.city" />
            </v-col>
            <v-col cols="6" sm="3">
              <v-text-field-with-validation
                label="Zip"
                :rules="{ required: true, regex: zipCodeRegex }"
                v-facade="zipCodeMask"
                v-model="adultData.zip"
                autocomplete="postal-code"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <v-select-with-validation
                v-model="adultData.state"
                :items="states"
                :rules="{ required: true, oneOf: states }"
                label="State"
                autocomplete="address-level1"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field-with-validation
                rules="required|email"
                v-model="adultData.email"
                label="E-mail"
                autocomplete="email"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="adultData.primaryPhone"
                label="Mobile Phone Number"
                autocomplete="tel"
                disabled
              />
            </v-col>
            <v-col cols="6">
              <v-text-field-with-validation
                :rules="{ regex: phoneNumberRegex }"
                v-model="adultData.altPhone"
                v-facade="phoneNumberMask"
                label="Alt Phone Number"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
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

  adultData = vxm.registration.adultRegistration

  async validate () {
    const formValidation = await this.$refs.form.validate()
    return this.adultData.isValid && formValidation
  }
}
</script>
