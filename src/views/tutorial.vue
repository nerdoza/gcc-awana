<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <v-carousel height="100%" hide-delimiter-background id="tutorial" :continuous="false">
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet height="100%">
              <v-row class="fill-height" align="center" justify="center">
                <v-img :src="slide" aspect-ratio="0.643" contain></v-img>
              </v-row>
            </v-sheet>
          </v-carousel-item>
          <v-carousel-item>
            <v-sheet height="100%">
              <v-row class="fill-height" align="center" justify="center">
                <v-btn color="primary" @click="getStarted" dark large>
                  Get Started
                  <v-icon class="ml-2">$right</v-icon>
                </v-btn>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import clubber1 from '@/assets/images/tutorial/clubber1.png'
import dashboard from '@/assets/images/tutorial/dashboard.png'
import menu from '@/assets/images/tutorial/menu.png'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  readonly slides = [
    menu,
    dashboard,
    clubber1
  ]

  mounted () {
    vxm.system.setTutorialViewed()
  }

  getStarted () {
    this.$router.push({ name: 'Updates' })
  }
}
</script>

<style lang="scss">
#tutorial {
  .v-sheet.theme--dark {
    background: transparent;
  }
}
</style>
