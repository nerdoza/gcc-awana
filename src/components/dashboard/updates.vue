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

import UpdateCard from '@/components/cards/updateCard.vue'

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
        text: 'Join us for week 1 of AWANA! Meet your leaders and fellow clubbers, and get started on your verses.'
      },
      cubbies: {
        text: 'This week we are starting with the fundamentals of the Gospel. Who is Jesus and why does he love us?',
        video: 'http://www.youtube.com'
      },
      sparks: {
        text: 'Mr. Sparky welcomes everyone with a great puppet-show inspired by Jonah and the whale.',
        video: 'http://www.youtube.com'
      },
      tnt: {
        text: 'Agents of Grace 1.1 dives into God as our Savior. Why do we need saving? Find out more as you explore what it means to put your hope in Jesus!',
        video: 'https://player.vimeo.com/video/281657526'
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
