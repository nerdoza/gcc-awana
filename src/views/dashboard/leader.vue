<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Leader</v-toolbar-title>
          </v-toolbar>
          <v-card-title>
            <v-icon class="mr-3">$wip</v-icon>Work in progress
          </v-card-title>
          <v-card-text>
            <p>We are still working out some of the details, so please check back later this week to see your assigned clubbers for the year as well as some cool new tools!</p>
            <h4>Thank you for your continued dedication to the youth at GCC Visalia.</h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {

}
</script>
