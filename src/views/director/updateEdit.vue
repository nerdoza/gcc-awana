<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Edit Update</v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$left</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="headline">{{ title }}</div>
                <v-subheader
                  class="px-0"
                >{{ (update.postAt > now ? 'Will post on' : 'Posted on') }} {{postAtString}}</v-subheader>
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="headline">
                    <v-avatar :color="clubColor" class="mr-2">
                      <img :src="clubImg" />
                    </v-avatar>
                    {{ clubTitle }}
                  </v-card-title>
                  <v-card-text>
                    <v-textarea label="Message" v-model="update.text" />
                    <v-text-field label="Video" v-model="update.video" />
                  </v-card-text>
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import cubbiesImg from '@/assets/images/cubbies.png'
import gccImg from '@/assets/images/gcc_arms.png'
import sparksImg from '@/assets/images/sparks.png'
import tntImg from '@/assets/images/tnt.png'
import DeleteUpdateCard from '@/components/cards/deleteUpdateCard.vue'
import { fiveMinutes, getClubColor, getClubImg, getTimeString } from '@/const'
import { vxm } from '@/store'

@Component({
  components: {
    DeleteUpdateCard
  }
})
export default class extends Vue {
  @Prop() readonly uid!: string

  readonly gccImg = gccImg
  readonly cubbiesImg = cubbiesImg
  readonly sparksImg = sparksImg
  readonly tntImg = tntImg

  loading = false
  deleteDialog = false

  get club () {
    switch (vxm.user.club) {
      case 'c':
        return 'cubbies'
      case 's':
        return 'sparks'
      case 'b':
      case 'g':
        return 'tnt'
    }
    return 'general'
  }

  get clubImg () {
    return getClubImg(vxm.user.club)
  }

  get clubColor () {
    return getClubColor(vxm.user.club)
  }

  get clubTitle () {
    switch (vxm.user.club) {
      case 'c':
        return 'Cubbies'
      case 's':
        return 'Sparks'
      case 'b':
      case 'g':
        return 'T&T'
    }
    return 'All Clubs'
  }

  get updateRecord () {
    return vxm.updates.updates[this.uid]
  }

  get title () {
    return this.updateRecord.title
  }

  get postAtString () {
    return getTimeString(this.updateRecord.postAt)
  }

  update = {
    text: this.updateRecord[this.club]?.text ?? '',
    video: this.updateRecord[this.club]?.video ?? ''
  }

  async mounted () {
    if (vxm.updates.sinceUpdate > fiveMinutes) {
      await vxm.updates.getUpdates()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.updates.getUpdate({ uid: this.uid })
    this.update = {
      text: this.updateRecord[this.club]?.text ?? '',
      video: this.updateRecord[this.club]?.video ?? ''
    }
    this.loading = false
  }

  get now () {
    return Date.now()
  }

  close () {
    this.$router.go(-1)
  }

  async remove () {
    await vxm.updates.deleteUpdate({ uid: this.uid })
    this.close()
  }

 @Watch('update', { deep: true })
  async onUpdateChanged ({ text, video }: { text: string, video: string }) {
    const updateSource = { [this.club]: { text, video } }
    await vxm.updates.updateUpdateContent({ uid: this.uid, update: updateSource })
  }
}
</script>
