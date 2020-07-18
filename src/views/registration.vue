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
                  v-if="childData.isEmpty"
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

          <v-stepper-step :complete="stepStatus > 3" step="3">Additional Contacts</v-stepper-step>
          <v-stepper-content step="3">
            <additional-contacts ref="additionalContactsForm" v-if="stepStatus === 3" />
            <v-row>
              <v-col cols="auto">
                <v-btn
                  v-if="additionalContactsData.isEmpty"
                  color="primary"
                  @click="validateAdditionalContacts()"
                >Skip</v-btn>
                <v-btn v-else color="primary" @click="validateAdditionalContacts()">Continue</v-btn>
                <v-btn text @click="goBack()">Back</v-btn>
              </v-col>
              <v-spacer />
              <v-col cols="auto">
                <v-btn color="primary" @click="addContact()">Add Contact</v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step :complete="stepStatus > 4" step="4">Leader Volunteer</v-stepper-step>
          <v-stepper-content step="4">
            <volunteer ref="volunteerForm" v-if="stepStatus === 4" />
            <v-row>
              <v-col cols="auto">
                <v-btn color="primary" @click="validateVolunteer()">Continue</v-btn>
                <v-btn text @click="goBack()">Back</v-btn>
              </v-col>
            </v-row>
          </v-stepper-content>

          <v-stepper-step :complete="stepStatus > 5" step="5">Terms &amp; Conditions</v-stepper-step>
          <v-stepper-content step="5">
            <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
            <v-btn color="primary" @click="completeStep()">Continue</v-btn>
            <v-btn text @click="goBack()">Back</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="stepStatus > 6" step="6">Confirm Information</v-stepper-step>
          <v-stepper-content step="6">
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

import AdditionalContacts from '@/components/registration/additionalContacts.vue'
import AdultRegistration from '@/components/registration/adultRegistration.vue'
import ChildRegistration from '@/components/registration/childRegistration.vue'
import Volunteer from '@/components/registration/volunteer.vue'
import { vxm } from '@/store'

@Component({
  components: {
    ValidationObserver,
    AdultRegistration,
    ChildRegistration,
    Volunteer,
    AdditionalContacts
  }
})
export default class extends Vue {
  $refs!: {
    adultRegistrationForm: InstanceType<typeof AdultRegistration>
    childRegistrationForm: InstanceType<typeof ChildRegistration>
    volunteerForm: InstanceType<typeof Volunteer>
    additionalContactsForm: InstanceType<typeof AdditionalContacts>
  }

  childData = vxm.registration.childRegistrations
  additionalContactsData = vxm.registration.additionalContacts

  @PropSync('step', { type: Number, default: 1 }) stepStatus!: number

  async validateAdultRegistration () {
    const success = await this.$refs.adultRegistrationForm.validate()
    if (success) {
      this.goForward()
    }
  }

  addChild () {
    this.$refs.childRegistrationForm.addChild()
  }

  async validateChildRegistration () {
    const success = await this.$refs.childRegistrationForm.validate()
    if (success) {
      this.goForward()
    }
  }

  addContact () {
    this.$refs.additionalContactsForm.addContact()
  }

  async validateAdditionalContacts () {
    const success = await this.$refs.additionalContactsForm.validate()
    if (success) {
      this.goForward()
    }
  }

  async validateVolunteer () {
    const success = await this.$refs.volunteerForm.validate()
    if (success) {
      this.goForward()
    }
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
