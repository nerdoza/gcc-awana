<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Help</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pb-0 pt-4">
      <p>This app is created and supported by the Awana Directors at Grace Community Church Visalia. We will do our best to help you with any questions or issues you have.</p>
      <p>
        <router-link :to="{ name: 'Tutorial' }">
          <v-icon small color="primary" class="mr-2">$video</v-icon>Tutorial
        </router-link>
      </p>
      <p>
        <strong>Grace Community Church Visalia</strong>
        <br />
        <a href="tel:1-559-733-3966">+1 (559) 733-3966</a>
      </p>
      <p>
        <router-link :to="{ name: 'Terms' }">Terms &amp; Conditions</router-link>
        <br />
        <router-link :to="{ name: 'Privacy' }">Privacy Policy</router-link>
      </p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <div class="pl-4 text-caption" @click="aboutTapped">App Version: {{appVersion}}</div>
    </v-card-actions>
    <v-card-actions v-if="aboutTap >= 10">
      <v-img src="~@/assets/images/easterEggs/asa.jpg" contain aspect-ratio="0.75"></v-img>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  readonly appVersion = process.env.VUE_APP_VERSION ?? ''
  aboutTap = 0

  aboutTapped () {
    this.aboutTap++
  }

  @Emit()
  close () {
    this.aboutTap = 0
    return null
  }
}
</script>
