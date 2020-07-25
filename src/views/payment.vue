<template>
  <v-container fluid class="fill-height">
    <v-row class="payment-view" align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Payment</v-toolbar-title>
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
          <div>
            <h1>Payment</h1>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { vxm } from '@/store'

@Component
export default class extends Vue {
  signOutDialog = false

  registrationData = vxm.registration

  signOut () {
    this.signOutDialog = false
    vxm.auth.signOut()
  }
}
</script>
