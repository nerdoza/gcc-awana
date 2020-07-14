<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="4">
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
              v-model="code"
            ></v-text-field>
          </v-form>
          <div
            class="text--primary"
          >If you do not receive a code within 2 minutes, request a new code.</div>
        </v-card-text>
        <v-card-actions>
          <v-btn :disabled="codeValid">Send New Code</v-btn>
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

@Component({
  directives: {
    facade
  }
})
export default class extends Vue {
  verificationCodeMask = verificationCodeMask
  code = ''

  get codeValid () {
    return verificationCodeRegex.test(this.code)
  }

  submit () {
    if (this.codeValid) {
      this.$router.push({ name: 'Registration' })
    }
  }
}
</script>
