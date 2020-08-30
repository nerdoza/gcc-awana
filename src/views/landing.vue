<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-card class="elevation-12">
              <v-card-text class="pb-0">
                <v-row align="center" justify="center">
                  <v-col cols="5">
                    <v-img src="~@/assets/images/gcc.png"></v-img>
                  </v-col>
                  <v-col cols="5">
                    <v-img src="~@/assets/images/awana.svg"></v-img>
                  </v-col>
                </v-row>
                <h1 class="mb-4">Welcome</h1>
                <p>This app is meant for parents and leaders of Grace Community Church Awana program. Track book progress, calculate clubber's points, and receive important instructions from the Awana directors all in one place.</p>
                <p>If you have any questions, please contact the Church offices and ask for Brittany Kalmink.</p>
              </v-card-text>
              <v-container class="pt-0">
                <v-row>
                  <v-col cols="auto">
                    <v-list-item-title class="text--gray">
                      Grace Community Church
                      <br />
                      <a href="tel:1-559-733-3966">+1 (559) 733-3966</a>
                    </v-list-item-title>
                  </v-col>
                  <v-spacer />
                  <v-col cols="auto" align="right">
                    <v-btn color="primary" @click="getStarted()">Get Started</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
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
