<template>
  <v-row class="registration-view" align="center" justify="center">
    <v-col cols="12" sm="10" md="8" lg="6" xl="3">
      <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Registration</v-toolbar-title>
        </v-toolbar>
        <v-stepper v-model="stepStatus" vertical>
          <v-stepper-step :complete="stepStatus > 1" step="1">
            Adult Registartion
            <small>Fill with your personal information</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <adult-registration ref="adultRegistrationForm" v-if="stepStatus === 1" />
            <v-row>
              <v-col cols="auto">
                <v-btn color="primary" @click="validateAdultRegistration()">Continue</v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step :complete="stepStatus > 2" step="2">
            Child Registartion
            <small>Fill with your child's information</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <child-registration ref="childRegistrationForm" v-if="stepStatus === 2" />
            <v-row>
              <v-col cols="auto">
                <v-btn
                  v-if="childRegistrationData.isEmpty"
                  color="primary"
                  @click="validateChildRegistration()"
                >Skip</v-btn>
                <v-btn v-else color="primary" @click="validateChildRegistration()">Continue</v-btn>
                <v-btn text @click="goBack()">Back</v-btn>
              </v-col>
              <v-spacer />
              <v-col cols="auto">
                <v-btn color="primary" @click="addChild()">Add Child</v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step :complete="stepStatus > 3" step="3">Leader Volunteer</v-stepper-step>
          <v-stepper-content step="3">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="completeStep()">Continue</v-btn>
            <v-btn text @click="goBack()">Back</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepStatus > 4" step="4">Terms &amp; Conditions</v-stepper-step>
          <v-stepper-content step="4">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="completeStep()">Continue</v-btn>
            <v-btn text @click="goBack()">Back</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepStatus > 5" step="5">Confirm Information</v-stepper-step>
          <v-stepper-content step="4">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="completeStep()">Continue</v-btn>
            <v-btn text @click="goBack()">Back</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { Component, PropSync, Vue } from 'vue-property-decorator'

import AdultRegistration from '@/components/adultRegistration.vue'
import ChildRegistration from '@/components/childRegistration.vue'
import { vxm } from '@/store'

@Component({
  components: {
    ValidationObserver,
    AdultRegistration,
    ChildRegistration
  }
})
export default class extends Vue {
  $refs!: {
    adultRegistrationForm: InstanceType<typeof AdultRegistration>
    childRegistrationForm: InstanceType<typeof ChildRegistration>
  }

  adultRegistrationData = vxm.registration.adultRegistration
  childRegistrationData = vxm.registration.childRegistrations

  @PropSync('step', { type: Number, default: 1 }) stepStatus!: number

  async validateAdultRegistration () {
    const success = await this.$refs.adultRegistrationForm.validate()
    if (success) {
      this.goForward()
    }
  }

  async validateChildRegistration () {
    const success = await this.$refs.childRegistrationForm.validate()
    if (success) {
      this.goForward()
    }
  }

  addChild () {
    this.childRegistrationData.addChild()
  }

  goBack () {
    this.$router.push({ name: 'Registration', params: { step: (this.stepStatus - 1).toString() } })
  }

  goForward () {
    this.$router.push({ name: 'Registration', params: { step: (this.stepStatus + 1).toString() } })
  }

  completeStep () {
    this.goForward()
  }
}
</script>

<style lang="scss">
.registration-view {
  .v-card {
    transition-delay: 1s;
    transition: opacity 0.3s;
  }

  .v-stepper__step__step .v-icon.v-icon.fa-check {
    font-size: 1rem;
  }
}
</style>
