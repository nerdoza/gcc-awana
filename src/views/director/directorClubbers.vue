<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ clubName }} Clubbers</v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="pb-0">
            <template v-if="!isCordova">
              <v-row align="center" justify="center">
                <v-col cols="12" sm="6" class="pa-0">
                  <v-btn dark class="secondary mx-2" @click="download">
                    <v-icon>$download</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6" class="pa-0">
                  <v-text-field v-model="search" append-icon="$search" label="Search"></v-text-field>
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-text-field v-model="search" append-icon="$search" label="Search"></v-text-field>
            </template>
          </v-card-text>
          <v-data-table
            :headers="headers"
            :items="clubbersList"
            :search="search"
            :items-per-page="15"
            @click:row="editClubber"
            :loading="loading"
            loading-text="Loading Clubbers..."
            class="clickable"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="clubberEditDialog" max-width="700px" transition="dialog-bottom-transition">
      <clubber-card
        v-if="clubberEditDialog"
        :clubber="focusClubber"
        :leaders="leaders"
        v-on:update="updateClubber"
        v-on:close="clubberEditDialog = false"
      ></clubber-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ClubberCard from '@/components/cards/directorClubberCard.vue'
import { firestoreCollections, getClubByValue, getFullname, getGradeByValue, isCordova } from '@/const'
import { createCSV } from '@/lib/csv'
import firebaseProject from '@/plugins/firebase'
import { vxm } from '@/store'

@Component({
  components: {
    ClubberCard
  }
})
export default class extends Vue {
  clubbers: {[index: string]: Clubber} = {}
  leaders: {[index: string]: User} = {}
  loading = false
  search = ''
  clubberEditDialog = false
  focusClubber : null | {uid: string, clubber: Clubber} = null

  readonly isCordova = isCordova

  readonly headers = [
    { text: 'Name', value: 'clubber.fullName' },
    { text: 'Grade', value: 'clubber.gradeName', groupable: true },
    { text: 'Leader', value: 'clubber.leaderName', groupable: true }
  ]

  get clubName () {
    return getClubByValue(vxm.user.club)
  }

  get clubbersList () {
    return Object.keys(this.clubbers).map(uid => ({
      uid,
      clubber: {
        ...this.clubbers[uid],
        gradeName: getGradeByValue(this.clubbers[uid].grade),
        fullName: getFullname(this.clubbers[uid]),
        leaderName: this.getLeaderName(this.clubbers[uid])
      }
    }))
  }

  getLeaderName (clubber: Clubber) {
    return (typeof clubber.leader !== 'undefined' && this.leaders[clubber.leader]) ? this.leaders[clubber.leader].firstName + ' ' + this.leaders[clubber.leader].lastName : ''
  }

  async mounted () {
    await this.refreshData()
  }

  async refreshData () {
    this.loading = true
    this.clubbers = await firebaseProject.getCollection(firestoreCollections.clubbers, {
      where: [
        { fieldPath: 'club', opStr: '==', value: vxm.user.club }
      ]
    }) as {[index: string]: Clubber}

    const userRoles = await firebaseProject.getCollection(firestoreCollections.userRoles, {
      where: [
        { fieldPath: 'club', opStr: '==', value: vxm.user.club }
      ]
    }) as {[index: string]: UserRole}

    const allUsers = await firebaseProject.getCollection(firestoreCollections.users) as {[index: string]: User}

    const leaders: {[index: string]: User} = {}
    Object.keys(userRoles).forEach(key => {
      leaders[key] = allUsers[key]
    })

    this.leaders = leaders
    this.loading = false
  }

  editClubber (clubber: {uid: string, clubber: Clubber}) {
    this.focusClubber = clubber
    this.clubberEditDialog = true
  }

  updateClubber ({ uid, clubber }: {uid: string, clubber: Clubber}) {
    this.$set(this.clubbers, uid, clubber)
  }

  download () {
    const data = Object.keys(this.clubbers).map(uid => ({
      'First Name': this.clubbers[uid].firstName,
      'Last Name': this.clubbers[uid].lastName,
      Club: this.clubbers[uid].club,
      Birthday: this.clubbers[uid].birthday,
      Gender: this.clubbers[uid].gender,
      Grade: this.clubbers[uid].grade,
      'Parent Phone 1': (this.clubbers[uid].parents ?? [])[0] ?? '',
      'Parent Phone 2': (this.clubbers[uid].parents ?? [])[1] ?? '',
      'Parent Phone 3': (this.clubbers[uid].parents ?? [])[2] ?? '',
      'Parent Phone 4': (this.clubbers[uid].parents ?? [])[3] ?? ''
    }))

    createCSV(data, 'clubbers.csv')
  }
}
</script>
