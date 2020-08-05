<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
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
                      v-model.trim="auth.phoneNumber"
                      label="Mobile Phone Number"
                      autocomplete="tel"
                      disabled
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </validation-observer>
          <v-divider></v-divider>
          <v-container>
            <v-row>
              <v-col cols="auto"></v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <v-dialog v-model="signOutDialog" persistent max-width="290">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" color="primary">
                      <v-icon left dark>$signOut</v-icon>Sign Out
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="headline">Sign Out</v-card-title>
                    <v-card-text>This will completely sign you out.</v-card-text>
                    <v-card-actions>
                      <v-btn color="primary" @click="signOutDialog = false">Cancel</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="signOut">Sign Out</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { debounce } from 'ts-debounce'
import { ValidationObserver } from 'vee-validate'
import { Component, Ref, Vue, Watch } from 'vue-property-decorator'

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

  readonly debouncedSave = debounce(() => { void vxm.user.setProfile() }, 3000)

  signOutDialog = false
  auth = vxm.auth
  user = vxm.user

  async validate () {
    return await this.form.validate()
  }

  @Watch('user.firstName')
  onFirstNameChanged () {
    this.save()
  }

  @Watch('user.lastName')
  onLastNameChanged () {
    this.save()
  }

  @Watch('user.email')
  onEmailChanged () {
    this.save()
  }

  async save () {
    if (await this.validate()) {
      this.debouncedSave()
    }
  }

  signOut () {
    this.signOutDialog = false
    vxm.auth.signOut()
  }
}
</script>
