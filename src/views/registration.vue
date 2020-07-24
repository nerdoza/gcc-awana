<template>
  <v-container fluid class="fill-height">
    <v-row class="registration-view" align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Registration</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="signOutDialog" persistent max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>$signOut</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">Sign Out</v-card-title>
                <v-card-text>This will clear the registration form data and completely sign you out.</v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="signOutDialog = false">Cancel</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="signOut">Sign Out</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-stepper v-model="stepStatus" vertical>
            <v-stepper-step :complete="lastStepCompleted >= 1" step="1">
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

            <v-stepper-step :complete="lastStepCompleted >= 2" step="2">
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
                  <v-btn color="primary" @click="addChild()">
                    <v-icon>$addUser</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step :complete="lastStepCompleted >= 3" step="3">
              Additional Contacts
              <small>Other adults authorized to care for and assist in emergencies</small>
            </v-stepper-step>
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
                  <v-btn color="primary" @click="addContact()">
                    <v-icon>$addUser</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step :complete="lastStepCompleted >= 4" step="4">Leader Volunteer</v-stepper-step>
            <v-stepper-content step="4">
              <volunteer ref="volunteerForm" v-if="stepStatus === 4" />
              <v-row>
                <v-col cols="auto">
                  <v-btn color="primary" @click="validateVolunteer()">Continue</v-btn>
                  <v-btn text @click="goBack()">Back</v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step :complete="lastStepCompleted >= 5" step="5">Terms &amp; Conditions</v-stepper-step>
            <v-stepper-content step="5">
              <terms ref="termsForm" v-if="stepStatus === 5" />
              <v-row>
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    @click="validateTerms()"
                    :disabled="!termsData.approvedTerms"
                  >Continue</v-btn>
                  <v-btn text @click="goBack()">Back</v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>

            <v-stepper-step :complete="lastStepCompleted >= 6" step="6">Confirm Information</v-stepper-step>
            <v-stepper-content step="6">
              <review v-if="stepStatus === 6" />
              <v-row>
                <v-col cols="auto">
                  <v-btn color="primary" @click="completeRegistration()">Continue</v-btn>
                  <v-btn text @click="goBack()">Back</v-btn>
                </v-col>
              </v-row>
            </v-stepper-content>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { Component, PropSync, Vue, Watch } from 'vue-property-decorator'

import AdditionalContacts from '@/components/registration/additionalContacts.vue'
import AdultRegistration from '@/components/registration/adultRegistration.vue'
import ChildRegistration from '@/components/registration/childRegistration.vue'
import Review from '@/components/registration/review.vue'
import Terms from '@/components/registration/terms.vue'
import Volunteer from '@/components/registration/volunteer.vue'
import { vxm } from '@/store'

@Component({
  components: {
    ValidationObserver,
    AdultRegistration,
    ChildRegistration,
    Volunteer,
    AdditionalContacts,
    Terms,
    Review
  }
})
export default class extends Vue {
  $refs!: {
    adultRegistrationForm: InstanceType<typeof AdultRegistration>
    childRegistrationForm: InstanceType<typeof ChildRegistration>
    volunteerForm: InstanceType<typeof Volunteer>
    additionalContactsForm: InstanceType<typeof AdditionalContacts>
    termsForm: InstanceType<typeof Terms>
  }

  signOutDialog = false
  lastStepCompleted = 0
  registrationData = vxm.registration
  childData = vxm.registration.childRegistrations
  additionalContactsData = vxm.registration.additionalContacts
  termsData = vxm.registration.terms

  @PropSync('step', { type: Number, default: 1 }) stepStatus!: number

  @Watch('stepStatus', { immediate: true })
  onStepChanged (value: number) {
    if (value > this.lastStepCompleted) {
      this.lastStepCompleted = value
    }
    if (value === 6) {
      this.registrationData.isReviewing = true
    }
  }

  mounted () {
    if (vxm.auth.phoneNumber !== null) {
      vxm.registration.adultRegistration.primaryPhone = vxm.auth.phoneNumber
    }
  }

  async validateAdultRegistration () {
    const success = await this.$refs.adultRegistrationForm.validate()
    if (success) {
      this.goForward()
    }
  }

  signOut () {
    this.signOutDialog = false
    vxm.auth.signOut()
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

  async validateTerms () {
    const success = await this.$refs.termsForm.validate()
    if (success) {
      this.goForward()
    }
  }

  completeRegistration () {
    this.$router.push({ name: 'Payment' })
  }

  goBack () {
    this.$router.push({ name: 'Registration', params: { step: (this.stepStatus - 1).toString() } })
  }

  goForward () {
    const step = !this.registrationData.isReviewing ? (this.stepStatus + 1).toString() : '6'
    this.$router.push({ name: 'Registration', params: { step } })
  }
}
</script>
