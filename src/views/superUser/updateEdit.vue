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
                <div
                  class="headline mb-4"
                >{{ (update.postAt > now ? 'Will post on' : 'Posted on') }} {{postAtString}}</div>
                <v-text-field label="Title" v-model="update.title" />
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="headline">
                    <v-avatar color="green darken-3" class="mr-2">
                      <img :src="gccImg" />
                    </v-avatar>All Clubs
                  </v-card-title>
                  <v-card-text>
                    <v-textarea label="All Club Message" v-model="update.general.text" />
                    <v-text-field label="All Club Video" v-model="update.general.video" />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="headline">
                    <v-avatar color="light-green lighten-3" class="mr-2">
                      <img :src="cubbiesImg" />
                    </v-avatar>Cubbies
                  </v-card-title>
                  <v-card-text>
                    <v-textarea label="Cubbies Message" v-model="update.cubbies.text" />
                    <v-text-field label="Cubbies Video" v-model="update.cubbies.video" />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="headline">
                    <v-avatar color="amber lighten-3" class="mr-2">
                      <img :src="sparksImg" />
                    </v-avatar>Sparks
                  </v-card-title>
                  <v-card-text>
                    <v-textarea label="Sparks Message" v-model="update.sparks.text" />
                    <v-text-field label="Sparks Video" v-model="update.sparks.video" />
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="headline">
                    <v-avatar color="blue lighten-3" class="mr-2">
                      <img :src="tntImg" />
                    </v-avatar>T&amp;T
                  </v-card-title>
                  <v-card-text>
                    <v-textarea label="T&amp;T Message" v-model="update.tnt.text" />
                    <v-text-field label="T&amp;T Video" v-model="update.tnt.video" />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <v-dialog v-model="deleteDialog" persistent max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-2 secondary" v-bind="attrs" v-on="on">
                  <v-icon class="mr-2">$trash</v-icon>Delete
                </v-btn>
              </template>
              <delete-update-card v-on:remove="remove" v-on:close="deleteDialog = false"></delete-update-card>
            </v-dialog>
          </v-card-actions>
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
import { fiveMinutes, getTimeString } from '@/const'
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

  update = {
    ...vxm.updates.updates[this.uid],
    general: { ...vxm.updates.updates[this.uid]?.general || { text: '', video: '' } },
    cubbies: { ...vxm.updates.updates[this.uid]?.cubbies || { text: '', video: '' } },
    sparks: { ...vxm.updates.updates[this.uid]?.sparks || { text: '', video: '' } },
    tnt: { ...vxm.updates.updates[this.uid]?.tnt || { text: '', video: '' } }
  }

  get postAtString () {
    return getTimeString(this.update.postAt)
  }

  async mounted () {
    if (vxm.updates.sinceUpdate > fiveMinutes) {
      await vxm.updates.getUpdates()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.updates.getUpdates()
    this.update = {
      ...vxm.updates.updates[this.uid],
      general: { ...vxm.updates.updates[this.uid]?.general || { text: '', video: '' } },
      cubbies: { ...vxm.updates.updates[this.uid]?.cubbies || { text: '', video: '' } },
      sparks: { ...vxm.updates.updates[this.uid]?.sparks || { text: '', video: '' } },
      tnt: { ...vxm.updates.updates[this.uid]?.tnt || { text: '', video: '' } }
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
  async onUpdateChanged (update: { title: string, general: ClubSpecificUpdate, cubbies: ClubSpecificUpdate, sparks: ClubSpecificUpdate, tnt: ClubSpecificUpdate }) {
    const updateSource: { title: string, general?: ClubSpecificUpdate, cubbies?: ClubSpecificUpdate, sparks?: ClubSpecificUpdate, tnt?: ClubSpecificUpdate } = { title: update.title }

    if (update.general.text !== '' || update.general.video !== '') {
      updateSource.general = { ...update.general }
    }
    if (update.cubbies.text !== '' || update.cubbies.video !== '') {
      updateSource.cubbies = { ...update.cubbies }
    }
    if (update.sparks.text !== '' || update.sparks.video !== '') {
      updateSource.sparks = { ...update.sparks }
    }
    if (update.tnt.text !== '' || update.tnt.video !== '') {
      updateSource.tnt = { ...update.tnt }
    }

    await vxm.updates.updateUpdateContent({ uid: this.uid, update: updateSource })
  }
}
</script>
