<template>
  <v-container fluid class="fill-height" id="super-updates-list">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Weekly Updates</v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="createUpdate">
              <v-icon>$addWeeklyUpdate</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container class="pt-0">
            <v-row>
              <v-col cols="12" v-for="(record, index) in updatesList" :key="index">
                <template v-if="index === activeIndex && activeIndex > 0">
                  <v-divider></v-divider>
                  <div class="headline mx-4 my-2">Active</div>
                </template>
                <v-card>
                  <v-card-title class="headline">
                    <v-icon v-if="index === activeIndex" class="mr-2" color="primary">$stars</v-icon>
                    {{record.update.title}}
                  </v-card-title>
                  <v-card-subtitle
                    class="pb-0"
                  >{{ (record.update.postAt > now ? 'Will post on' : 'Posted on') }} {{getDateString(record.update.postAt)}}</v-card-subtitle>
                  <v-card-actions>
                    <v-row>
                      <v-col cols="12" sm="auto" class="py-0">
                        <v-list-item class="px-0">
                          <v-list-item-avatar
                            v-for="(club, index) in clubStatus(record.update)"
                            :key="index"
                            :color="club.color"
                            :class="club.class"
                            class="mx-2 my-0"
                          >
                            <v-img :src="club.img"></v-img>
                          </v-list-item-avatar>
                        </v-list-item>
                      </v-col>
                      <v-spacer />
                      <v-col cols="12" sm="auto" align="right" class="pb-0 pt-2">
                        <v-btn class="primary" @click="edit(record.uid)">Edit</v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { fiveMinutes, getClubColor, getClubImg, getDateString } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  readonly getDateString = getDateString

  loading = false

  get updatesList () {
    return vxm.updates.updatesList.sort((a, b) => a.update.postAt > b.update.postAt ? -1 : 1)
  }

  get activeIndex () {
    let firstActiveIndex = 0
    this.updatesList.find((record, index) => {
      if (record.update.postAt <= this.now) {
        firstActiveIndex = index
        return true
      }
    })
    return firstActiveIndex
  }

  get now () {
    return Date.now()
  }

  clubStatus (update: ClubUpdate) {
    const clubs = []
    const inactiveColor = 'grey lighten-2'

    const generalActive = typeof update.general !== 'undefined' && typeof update.general.text !== 'undefined' && update.general.text !== ''
    clubs.push({
      color: generalActive ? getClubColor('' as Club) : inactiveColor,
      class: generalActive ? {} : { grayscale: true },
      img: getClubImg('' as Club)
    })

    const cubbiesActive = typeof update.cubbies !== 'undefined' && typeof update.cubbies.text !== 'undefined' && update.cubbies.text !== ''
    clubs.push({
      color: cubbiesActive ? getClubColor('c' as Club) : inactiveColor,
      class: cubbiesActive ? {} : { grayscale: true },
      img: getClubImg('c' as Club)
    })

    const sparksActive = typeof update.sparks !== 'undefined' && typeof update.sparks.text !== 'undefined' && update.sparks.text !== ''
    clubs.push({
      color: sparksActive ? getClubColor('s' as Club) : inactiveColor,
      class: sparksActive ? {} : { grayscale: true },
      img: getClubImg('s' as Club)
    })

    const tntActive = typeof update.tnt !== 'undefined' && typeof update.tnt.text !== 'undefined' && update.tnt.text !== ''
    clubs.push({
      color: tntActive ? getClubColor('b' as Club) : inactiveColor,
      class: tntActive ? {} : { grayscale: true },
      img: getClubImg('b' as Club)
    })

    return clubs
  }

  async mounted () {
    if (vxm.updates.sinceUpdate > fiveMinutes) {
      await this.refreshData()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.updates.getUpdates()
    this.loading = false
  }

  async createUpdate () {
    this.$router.push({ name: 'SuperUpdateCreate' })
  }

  edit (uid: string) {
    this.$router.push({ name: 'SuperUpdateEdit', params: { uid } })
  }
}
</script>

<style lang="scss">
#super-updates-list {
  .grayscale .v-image__image {
    filter: grayscale(100%);
  }
}
</style>
