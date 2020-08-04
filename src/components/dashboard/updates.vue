<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" v-for="(update, index) in updates" :key="index">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <update-card :update="update"></update-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import UpdateCard from '@/components/dashboard/updateCard.vue'

@Component({
  components: {
    UpdateCard
  }
})
export default class extends Vue {
  updates: Array<ClubUpdates> = [
    {
      targetDate: new Date('08/05/2020'),
      general: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.'
      },
      cubbies: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      sparks: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      tnt: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      }
    },
    {
      targetDate: new Date('07/29/2020'),
      general: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      cubbies: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      sparks: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      tnt: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      }
    },
    {
      targetDate: new Date('07/22/2020'),
      general: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      cubbies: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      sparks: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      },
      tnt: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consectetur a erat nam at lectus.',
        video: 'http://www.youtube.com'
      }
    }
  ]
}
</script>
