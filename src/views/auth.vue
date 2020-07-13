<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Welcome</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click.stop="helpOpen = true" icon v-on="on">
                    <v-icon>$info</v-icon>
                  </v-btn>
                </template>
                <span>Help</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <div class="text--primary">Entering your mobile phone number below to get started.</div>
              <v-form>
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
              <v-btn color="primary" :disabled="!phoneNumberValid">Send code</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="helpOpen" max-width="400">
        <v-card>
          <v-card-title class="headline">Help</v-card-title>
          <v-card-text>
            This app is designed to assist parents and leaders involved in the Grace Community Church AWANA program.
            <br />If you would like to find out more about this program, contact:
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'

import { phoneNumberRegex } from '@/const'

@Component({
  directives: {
    mask
  }
})
export default class extends Vue {
  phoneNumber = ''
  phoneNumberValid = false
  helpOpen = false

  @Watch('phoneNumber')
  onPhoneNumberChanged (val: string) {
    this.phoneNumberValid = phoneNumberRegex.test(val)
  }
}
</script>
