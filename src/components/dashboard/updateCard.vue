<template>
  <v-card class="elevation-12 pb-2">
    <v-toolbar color="primary" flat dark>
      <v-toolbar-title>{{ clubDate | date('MMMM do') }} Club</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-icon v-if="isCurrentWeek">$stars</v-icon>
    </v-toolbar>
    <template v-for="(club, index) in clubs">
      <v-divider :key="'divider-' + index" class="mx-2 my-2" v-if="index > 0"></v-divider>
      <v-list-item :key="'list-' + index">
        <v-list-item-avatar :color="club.color">
          <v-img :src="club.img"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ club.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-text v-html="club.update.text" :key="index" class="pt-0 py-0"></v-card-text>
      <v-card-actions v-if="club.update.video" :key="'action-' + index" class="py-0">
        <v-spacer></v-spacer>
        <v-btn color="primary" :href="club.update.video" target="_blank">
          <v-icon class="mr-2">$video</v-icon>Watch Video
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script lang="ts">
import { isFuture, isToday } from 'date-fns'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import cubbiesImg from '@/assets/images/cubbies.png'
import gccImg from '@/assets/images/gcc_arms.png'
import sparksImg from '@/assets/images/sparks.png'
import tntImg from '@/assets/images/tnt.png'

@Component
export default class extends Vue {
  @Prop([Object]) readonly update!: ClubUpdates

  get clubDate () {
    return this.update.targetDate
  }

  get isCurrentWeek () {
    return isToday(this.clubDate) || isFuture(this.clubDate)
  }

  get clubs () {
    const clubs = []
    if (this.update.general) {
      clubs.push({
        name: 'All Clubs',
        color: 'grey darken-2',
        img: gccImg,
        update: this.update.general
      })
    }

    if (this.update.cubbies) {
      clubs.push({
        name: 'Cubbies',
        color: 'light-green lighten-3',
        img: cubbiesImg,
        update: this.update.cubbies
      })
    }

    if (this.update.sparks) {
      clubs.push({
        name: 'Sparks',
        color: 'amber lighten-3',
        img: sparksImg,
        update: this.update.sparks
      })
    }

    if (this.update.tnt) {
      clubs.push({
        name: 'T&T',
        color: 'deep-purple lighten-3',
        img: tntImg,
        update: this.update.tnt
      })
    }

    return clubs
  }
}
</script>
