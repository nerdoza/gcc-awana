<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="10" md="8" lg="6">
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Registration</v-toolbar-title>
      </v-toolbar>
      <v-stepper v-model="stepStatus" vertical>
        <v-stepper-step :complete="stepStatus > 1" step="1">
          Adult Registartion
          <small>Fill with your personal information.</small>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="completeStep()">Continue</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="stepStatus > 2" step="2">
          Child Registartion
          <small>Fill with your child's information.</small>
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="completeStep()">Continue</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="stepStatus > 3" step="3">Leader Volunteer</v-stepper-step>
        <v-stepper-content step="3">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="completeStep()">Continue</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>

        <v-stepper-step :complete="stepStatus > 4" step="4">Confirm Information</v-stepper-step>
        <v-stepper-content step="4">
          <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
          <v-btn color="primary" @click="completeStep()">Continue</v-btn>
          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class extends Vue {
  stepStatus = 1

  completeStep () {
    this.stepStatus++
  }
}
</script>

<style lang="scss">
.v-stepper__step__step .v-icon.v-icon.fa-check {
  font-size: 1rem;
}
</style>
