<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" v-for="(record, index) in clubbersList" :key="index">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title v-text="getFullname(record.clubber)"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="openClubber(record.cid)">
              <v-icon>$plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <template v-if="record.book.type === 't'">
              <p>T&amp;T</p>
            </template>
            <template v-if="record.book.type === 's'">
              <sparks-parent-progress :record="record"></sparks-parent-progress>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import SparksParentProgress from '@/components/partials/sparksParentProgress.vue'
import { fiveMinutes, getFullname } from '@/const'
import { vxm } from '@/store'

@Component({
  components: {
    SparksParentProgress
  }
})
export default class extends Vue {
  loading = false

  readonly getFullname = getFullname

  get clubbersList () {
    return vxm.clubbers.clubbersList
      .filter(record => record.clubber?.parents?.includes(vxm.user.phoneNumber))
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
