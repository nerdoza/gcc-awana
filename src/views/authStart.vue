<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Welcome</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog max-width="420">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>$info</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="headline">Help</v-card-title>
              <v-card-text>
                <p>This app is designed to assist parents and leaders involved in the Grace Community Church AWANA program.</p>
                <p>If you would like to find out more about this program, contact:</p>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-card-text>
          <div class="text--primary">Entering your mobile phone number below to get started.</div>
          <v-form @submit.prevent="submit()">
            <v-text-field
              label="Phone"
              name="phone"
              prepend-icon="$phone"
              type="tel"
              v-mask="'+1 (###) ###-####'"
              v-model="phoneNumber"
            ></v-text-field>
          </v-form>
          <div
            class="text--primary"
          >You will receive a text message with a code to complete your sign in.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!phoneNumberValid" @click="submit()">Send code</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'

import { phoneNumberRegex } from '@/const'

@Component({
  directives: {
    mask
  }
})
export default class extends Vue {
  phoneNumber = ''

  get phoneNumberValid () {
    return phoneNumberRegex.test(this.phoneNumber)
  }

  submit () {
    if (this.phoneNumberValid) {
      this.$router.push({ name: 'AuthVerification' })
    }
  }
}
</script>
