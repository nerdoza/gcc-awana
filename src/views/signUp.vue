<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Sign Up</v-toolbar-title>
              </v-toolbar>
              <validation-observer ref="form">
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field-with-validation
                          rules="required"
                          label="First Name"
                          v-model.trim="user.firstName"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field-with-validation
                          rules="required"
                          label="Last Name"
                          v-model.trim="user.lastName"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field-with-validation
                          rules="required|email"
                          v-model.trim="user.email"
                          v-on:input="user.email = $event.trim()"
                          label="E-mail"
                          autocomplete="email"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.trim="user.phoneNumber"
                          label="Mobile Phone Number"
                          autocomplete="tel"
                          disabled
                        />
                      </v-col>
                      <v-col cols="auto"></v-col>
                      <v-spacer />
                      <v-col cols="auto">
                        <v-btn
                          color="primary"
                          @click="submit()"
                          :disabled="submitting"
                          :loading="submitting"
                        >Continue</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </validation-observer>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { Component, Ref, Vue } from 'vue-property-decorator'

import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { vxm } from '@/store'

@Component({
  components: {
    ValidationObserver,
    VTextFieldWithValidation
  }
})
export default class extends Vue {
  @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>

  submitting = false
  user = vxm.user

  async validate () {
    const formValidation = await this.form.validate()
    return this.user.userIsValid && formValidation
  }

  async submit () {
    if (await this.validate()) {
      this.submitting = true
      try {
        await vxm.user.setProfile()
        this.$router.push({ name: 'Updates' })
      } catch (error) {
        this.submitting = false
      }
    }
  }
}
</script>
