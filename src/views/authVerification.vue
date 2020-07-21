<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6" lg="4" xl="2">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Verification</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div class="text--primary">Enter the code you received below.</div>
          <v-form @submit.prevent="submit()">
            <v-text-field
              label="Code"
              name="code"
              prepend-icon="$key"
              type="tel"
              v-facade="verificationCodeMask"
              v-model.trim="code"
              :error-messages="error"
            ></v-text-field>
          </v-form>
          <div
            class="text--primary"
          >If you do not receive a code within 2 minutes, request a new code.</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :id="verifierButtonId"
            @click="resendCode"
            :loading="resendingCode"
            :disabled="codeValid || resendingCode"
          >Send New Code</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!codeValid || verifyingCode"
            :loading="verifyingCode"
            @click="submit()"
          >Sign In</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { facade } from 'vue-input-facade'
import { Component, Vue } from 'vue-property-decorator'

import { verificationCodeMask, verificationCodeRegex } from '@/const'
import { vxm } from '@/store'

@Component({
  directives: {
    facade
  }
})
export default class extends Vue {
  readonly verifierButtonId = 'resend-code-button'
  auth = vxm.auth
  verificationCodeMask = verificationCodeMask
  resendingCode = false
  verifyingCode = false
  error = ''
  code = ''

  get codeValid () {
    return verificationCodeRegex.test(this.code)
  }

  async resendCode () {
    this.resendingCode = true
    // This timeout is a safety measure as sometimes the verification request hangs without a catchable error (just a window alert)
    setTimeout(() => { this.resendingCode = false }, 10000)
    try {
      await this.auth.requestVerification(this.verifierButtonId)
      this.error = ''
    } catch (error) {
      this.handleError(error)
    } finally {
      this.resendingCode = false
    }
  }

  async submit () {
    if (this.codeValid) {
      this.error = ''
      this.verifyingCode = true
      try {
        await this.auth.confirmVerification(this.code)
        this.auth.clearVerifier(this.verifierButtonId)
        this.$router.push({ name: 'Registration', params: { step: '1' } })
      } catch (error) {
        this.handleError(error)
      } finally {
        this.verifyingCode = false
      }
    }
  }

  handleError (error: {code: string, message?: string}) {
    console.error(error)
    this.code = ''
    const errorCode = typeof error.code !== 'undefined' ? error.code : error.message
    switch (errorCode) {
      case 'auth/invalid-verification-code':
        this.error = 'Invalid verification code. Re-enter code or request a new code.'
        break
      case 'auth/unknown-verification-request':
        this.error = 'No verification request submitted. Requesting a new code now.'
        void this.resendCode()
        break
    }
  }
}
</script>
