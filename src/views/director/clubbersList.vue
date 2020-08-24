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
  </v-container>
</template>

<script lang="ts">
import camelcase from 'camelcase'
import { Component, Vue } from 'vue-property-decorator'

import { fiveMinutes, getClubByValue, getFullname, getGradeByValue, isCordova } from '@/const'
import { exportClubberCSV } from '@/lib/csv'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  loading = false
  search = ''

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
    return vxm.clubbers.clubbersList
      .filter(record => record.clubber.club === vxm.user.club)
      .map(record => ({
        cid: record.cid,
        clubber: {
          ...record.clubber,
          fullName: getFullname(record.clubber),
          gradeName: getGradeByValue(record.clubber.grade),
          leaderName: this.getLeaderName(record.clubber.leader)
        }
      }))
  }

  getLeaderName (leader?: string) {
    return (typeof leader !== 'undefined' && vxm.appUsers.users[leader]) ? getFullname(vxm.appUsers.users[leader]) : ''
  }

  async mounted () {
    if (vxm.clubbers.sinceUpdate > fiveMinutes) {
      await this.refreshData()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.clubbers.getClubberRecords()
    await vxm.appUsers.getAppUsers()
    this.loading = false
  }

  editClubber (clubberRecord: ClubberRecord) {
    this.$router.push({ name: 'DirectorClubberEdit', params: { cid: clubberRecord.cid } })
  }

  download () {
    const club = camelcase(this.clubName.replace('\'', '').replace('&', ' and '), { pascalCase: true })
    exportClubberCSV(this.clubbersList, club + 'Clubbers.csv')
  }
}
</script>
