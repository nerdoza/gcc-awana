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
            ></v-text-field>
          </v-form>
          <div
            class="text--primary"
          >If you do not receive a code within 2 minutes, request a new code.</div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            id="resend-code-button"
            @click="resendCode"
            :loading="resendingCode"
            :disabled="codeValid || resendingCode"
          >Send New Code</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!codeValid" @click="submit()">Sign In</v-btn>
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
  auth = vxm.auth
  verificationCodeMask = verificationCodeMask
  resendingCode = false
  code = ''

  get codeValid () {
    return verificationCodeRegex.test(this.code)
  }

  async resendCode () {
    this.resendingCode = true
    setTimeout(() => { this.resendingCode = false }, 7000)
    try {
      await this.auth.requestVerification('resend-code-button')
    } catch (error) {
      console.error(error)
    }
  }

  submit () {
    if (this.codeValid) {
      this.$router.push({ name: 'Registration', params: { step: '1' } })
    }
  }
}
</script>
