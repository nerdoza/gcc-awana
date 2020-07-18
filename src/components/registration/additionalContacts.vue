<template>
  <validation-observer ref="form">
    <v-form>
      <v-card
        class="mb-6"
        v-for="(contact, index) in additionalContactsData.contacts"
        :key="index"
        outlined
        elevation="2"
      >
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field-with-validation
                rules="required"
                label="First Name"
                v-bind:value="contact.firstName"
                v-on:input="updateContact(index, {firstName: $event})"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field-with-validation
                rules="required"
                label="Last Name"
                v-bind:value="contact.lastName"
                v-on:input="updateContact(index, {lastName: $event})"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field-with-validation
                :rules="{ regex: phoneNumberRegex }"
                v-bind:value="contact.primaryPhone"
                v-on:input="updateContact(index, {primaryPhone: $event})"
                v-facade="phoneNumberMask"
                autocomplete="tel"
                label="Phone Number"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field-with-validation
                rules="required"
                label="Relationship"
                v-bind:value="contact.relationship"
                v-on:input="updateContact(index, {relationship: $event})"
              />
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="contact.hasChildAccess"
                @change="updateContact(index, {childAccess: $event})"
                label="Person should have access to children in their GCC AWANA app?"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
        <v-btn absolute fab bottom small right color="secondary" @click="deleteContact(index)">
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

import VTextareaWithValidation from '@/components/inputs/vTextareaWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { phoneNumberMask, phoneNumberRegex } from '@/const'
import { vxm } from '@/store'
import { ContactUpdate } from '@/store/registration'

@Component({
  directives: {
    facade
  },
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VTextareaWithValidation
  }
})
export default class extends Vue {
  $refs!: {
    form: InstanceType<typeof ValidationObserver>
  }

  readonly phoneNumberRegex = phoneNumberRegex
  readonly phoneNumberMask = phoneNumberMask

  additionalContactsData = vxm.registration.additionalContacts

  addContact () {
    this.additionalContactsData.addContact()
  }

  updateContact (index: number, props: ContactUpdate) {
    this.additionalContactsData.updateContact({ index, props })
  }

  deleteContact (index: number) {
    this.additionalContactsData.deleteContact({ index })
  }

  async validate () {
    if (this.additionalContactsData.isEmpty) {
      return true
    }

    const formValidation = await this.$refs.form.validate()
    return this.additionalContactsData.isValid && formValidation
  }
}
</script>
