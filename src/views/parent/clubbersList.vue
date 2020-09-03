<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" v-for="(record, index) in clubbersList" :key="index">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title v-text="record.clubber.fullName"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="openClubber(record.cid)">
              <v-icon>$right</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ImportClubber from '@/components/cards/importClubbersCard.vue'
import { fiveMinutes, getClubByValue, getFullname, getGradeByValue } from '@/const'
import { vxm } from '@/store'

@Component({
  components: {
    ImportClubber
  }
})
export default class extends Vue {
  loading = false

  get clubbersList () {
    return vxm.clubbers.clubbersList
      .filter(record => record.clubber?.parents?.includes(vxm.user.phoneNumber))
      .map(record => ({
        cid: record.cid,
        clubber: {
          ...record.clubber,
          fullName: getFullname(record.clubber),
          gradeName: getGradeByValue(record.clubber.grade),
          clubName: getClubByValue(record.clubber.club)
        }
      }))
  }

  async mounted () {
    if (vxm.clubbers.sinceUpdate > fiveMinutes) {
      await this.refreshData()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.clubbers.getClubberRecords()
    this.loading = false
  }

  openClubber (cid: string) {
    this.$router.push({ name: 'ParentClubberView', params: { cid } })
  }
}
</script>
