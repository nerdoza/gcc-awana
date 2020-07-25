<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign In</v-toolbar-title>
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
                  <p>Enter your mobile phone number in the field to start the sign in process.</p>
                  <p>If you already have an account created, this will sign you in. if you do not have an account yet, this will take you to the registration page where you can finish the setup process.</p>
                  <p>If you have further questions or concerns, please contact Brittany Kalmink.</p>
                  <p>
                    <strong>Grace Community Church</strong>
                    <br />
                    <a href="tel:1-559-733-3966">+1 (559) 733-3966</a>
                  </p>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-card-text>
            <div class="text--primary">Entering your mobile phone number below.</div>
            <v-form @submit.prevent="submit()">
              <v-text-field
                label="Phone"
                name="phone"
                prepend-icon="$phone"
                type="tel"
                v-facade="phoneNumberMask"
                v-model.trim="auth.phoneNumber"
                :error-messages="error"
              ></v-text-field>
            </v-form>
            <div
              class="text--primary"
            >You will receive a text message with a code to complete your sign in.</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :id="verifierButtonId"
              color="primary"
              :disabled="!phoneNumberValid || sendingCode"
              :loading="sendingCode"
              @click="submit()"
            >Send code</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { facade } from 'vue-input-facade'
import { Component, Vue } from 'vue-property-decorator'

import { phoneNumberMask } from '@/const'
import { vxm } from '@/store'

@Component({
  directives: {
    facade
  }
})
export default class extends Vue {
  readonly verifierButtonId = 'send-code-button'
  readonly phoneNumberMask = phoneNumberMask
  auth = vxm.auth
  error = ''
  sendingCode = false

  get phoneNumberValid () {
    return this.auth.isValidPhoneNumber
  }

  async submit () {
    if (this.auth.isValidPhoneNumber) {
      this.error = ''
      this.sendingCode = true
      try {
        await this.auth.requestVerification(this.verifierButtonId)
        this.$router.push({ name: 'AuthVerification' })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.sendingCode = false
      }
    }
  }

  handleError (error: {code: string, message?: string}) {
    const errorCode = typeof error.code !== 'undefined' ? error.code : error.message
    switch (errorCode) {
      case 'auth/invalid-phone-number':
        this.auth.clearPhoneNumber()
        this.error = 'Invalid phone number. Re-type phone number.'
        break
      default:
        throw errorCode
    }
  }

  beforeDestroy () {
    this.auth.clearVerifier(this.verifierButtonId)
  }
}
</script>
