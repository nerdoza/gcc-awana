<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-card-text>
            <v-row align="center" justify="center">
              <v-col cols="5">
                <v-img src="~@/assets/images/gcc.png"></v-img>
              </v-col>
              <v-col cols="5">
                <v-img src="~@/assets/images/awana.svg"></v-img>
              </v-col>
            </v-row>
            <h1 class="mb-4">Welcome</h1>
            <p>This app is meant for parents and leaders of Grace Community Church AWANA program. Through it, you will be able to register clubbers and leaders, track book progress, and receive important instructions from the AWANA directors.</p>
            <p>If you have any questions, please contact the Church offices and ask for Brittany Kalmink.</p>
          </v-card-text>
          <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-content>
                <v-list-item-title class="text--gray">
                  Grace Community Church
                  <br />
                  <a href="tel:1-559-733-3966">+1 (559) 733-3966</a>
                </v-list-item-title>
              </v-list-item-content>
              <v-btn color="primary" @click="getStarted()">Get Started</v-btn>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  getStarted () {
    this.$router.push({ name: 'AuthStart' })
  }
}
</script>
