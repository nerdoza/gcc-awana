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
      type: 'general',
      targetDate: new Date('08/14/2020'),
      general: {
        text: `
        The world looks a little different this year, but God's calling hasn't changed.
        This is going to be a great year of discipleship through the Awana Club program.
        Sometimes we will meet in person, sometimes we will meet digitally, but always we will be serving the Lord by equiping children with the Gospel.
        <br/><br/>
        The first Awana Club night is September 9th.
        You will receive your materials at the North Campus on that night. 
        Keep this app loaded on your phone and we'll send you updates with all the information you need.
        <br/><br/>
        This is going to be a great year, thanks for being part of it!
        `
      }
    }
  ]
}
</script>
