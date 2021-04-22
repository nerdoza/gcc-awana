<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Clubbers</v-toolbar-title>
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
                  <v-text-field
                    v-model="tableState.search"
                    clearable
                    :append-icon="tableState.search ? '' : '$search'"
                    label="Search"
                  ></v-text-field>
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-text-field
                v-model="tableState.search"
                clearable
                :append-icon="tableState.search ? '' : '$search'"
                label="Search"
              ></v-text-field>
            </template>
          </v-card-text>
          <v-data-table
            :headers="headers"
            :items="clubbersList"
            :items-per-page="15"
            :search="tableState.search"
            :options.sync="tableState.options"
            @click:row="viewClubber"
            :loading="loading"
            loading-text="Loading Clubbers..."
            class="clickable"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="clubberImportDialog" max-width="400px" transition="dialog-bottom-transition">
      <import-clubber v-if="clubberImportDialog" v-on:close="clubberImportDialog = false"></import-clubber>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import camelcase from 'camelcase'
import { Component, Vue, Watch } from 'vue-property-decorator'

import ImportClubber from '@/components/cards/importClubbersCard.vue'
import { fiveMinutes, getClubByValue, getFullname, isCordova } from '@/const'
import { createCSV } from '@/lib/csv'
import { cubbiesSectionsCompleted, cubbiesTotalSections } from '@/lib/cubbies'
import { sparksSegmentsCompleted, sparksTotalSegmentsRequirementsPerPass } from '@/lib/sparks'
import { tntSectionsCompleted, tntTotalSections } from '@/lib/tnt'
import { vxm } from '@/store'

const tableName = 'superClubbersList'

@Component({
  components: {
    ImportClubber
  }
})
export default class extends Vue {
  loading = false
  tableState = {
    search: '',
    options: {} as DataTableOptions
  }

  readonly isCordova = isCordova

  readonly headers = [
    { text: 'Name', value: 'clubber.fullName' },
    { text: 'Completion (%)', value: 'clubber.percentageCompleted', groupable: true },
    { text: 'Club', value: 'clubber.clubName', groupable: true }
  ]

  clubberImportDialog = false

  get clubName () {
    return getClubByValue(vxm.user.club)
  }

  get clubbersList () {
    return vxm.clubbers.clubbersList.map(record => {
      let percentageCompleted = 0
      switch (record.book.type) {
        case 'c':
          percentageCompleted = Math.round((cubbiesSectionsCompleted(record.book as CubbiesBook) / cubbiesTotalSections) * 100)
          break
        case 's':
          percentageCompleted = Math.min(Math.round((sparksSegmentsCompleted(record.book as SparksBook) / sparksTotalSegmentsRequirementsPerPass) * 100), 100)
          break
        case 't':
          percentageCompleted = Math.round((tntSectionsCompleted(record.book as TnTBook) / tntTotalSections) * 100)
          break
      }
      return {
        cid: record.cid,
        clubber: {
          ...record.clubber,
          fullName: getFullname(record.clubber),
          clubName: getClubByValue(record.clubber.club),
          percentageCompleted
        }
      }
    }
    )
  }

  async mounted () {
    const tableState = vxm.system.dataTableState[tableName]
    if (typeof tableState !== 'undefined') {
      this.tableState = { search: tableState.search, options: { ...tableState.options } }
    }

    if (vxm.clubbers.sinceUpdate > fiveMinutes) {
      await this.refreshData()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.clubbers.getClubberRecords()
    this.loading = false
  }

  viewClubber (clubberRecord: ClubberRecord) {
    this.$router.push({ name: 'AdminClubberView', params: { cid: clubberRecord.cid } })
  }

  download () {
    const club = camelcase(this.clubName.replace('\'', '').replace('&', ' and '), { pascalCase: true })
    const data = this.clubbersList.map(({ clubber }) => ({
      'First Name': clubber.firstName,
      'Last Name': clubber.lastName,
      Club: clubber.club,
      'Completion %': clubber.percentageCompleted
    }))
    createCSV(data, club + 'Clubbers.csv')
  }

  @Watch('tableState', { deep: true })
  async onTableStateChange (tableState: { options: DataTableOptions, search: string}) {
    await vxm.system.setDataTableState({ tableName, state: { ...tableState } })
  }
}
</script>
