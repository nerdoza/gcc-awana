<template>
  <div>
    <v-card class="mb-6" outlined elevation="2">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Adult Registration</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="goToStep(1)">
          <v-icon>$edit</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-row>
          <v-col cols="6">
            {{ adultData.firstName }} {{ adultData.lastName }}
            <br />
            {{ adultData.primaryPhone }}
            <br />
            {{ adultData.altPhone }}
            <br v-if="adultData.altPhone" />
            {{ adultData.email }}
          </v-col>
          <v-col cols="6">
            {{ adultData.streetAddress }}
            <br />
            {{ adultData.city }}, {{ adultData.state }} {{ adultData.zip }}
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card class="mb-6" outlined elevation="2">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Child Registration</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="goToStep(2)">
          <v-icon>$edit</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-row v-for="(child, index) in childData.children" :key="index">
          <v-col cols="12" v-if="index > 0">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="6" :class="{ 'pb-0': child.hasMedical} ">
            {{ child.firstName }} {{ child.lastName }}
            <br />
            {{ child.formattedDateOfBirth }}
          </v-col>
          <v-col cols="6" :class="{ 'pb-0': child.hasMedical} ">
            {{ child.grade | grade }}
            <br />
            {{ child.club }}
          </v-col>
          <v-col cols="12" class="pt-0" v-if="child.hasMedical">
            <strong>Medical:</strong>
            {{ child.medical }}
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card class="mb-6" outlined elevation="2">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Additional Contacts</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="goToStep(3)">
          <v-icon>$edit</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-row v-for="(contact, index) in additionalContactsData.contacts" :key="index">
          <v-col cols="12" v-if="index > 0">
            <v-divider></v-divider>
          </v-col>
          <v-col cols="6">
            {{ contact.firstName }} {{ contact.lastName }}
            <br />
            {{ contact.relationship }}
          </v-col>
          <v-col cols="6">
            {{ contact.primaryPhone }}
            <br />
            <v-icon v-if="contact.hasChildAccess" class="mr-1">$phone</v-icon>
            {{ contact.hasChildAccess ? 'App access' : 'No app access' }}
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { vxm } from '@/store'

@Component
export default class extends Vue {
  adultData = vxm.registration.adultRegistration
  childData = vxm.registration.childRegistrations
  additionalContactsData = vxm.registration.additionalContacts

  goToStep (step: number) {
    this.$router.push({ name: 'Registration', params: { step: step.toString() } })
  }
}
</script>
