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
            @click:row="editClubber"
            :loading="loading"
            loading-text="Loading Clubbers..."
            class="clickable"
          >
            <template v-slot:[colorLineHack]="{ item }">
              <v-chip
                :color="getColorLineColorByValue(item.colorLine)"
                v-if="item.colorLine"
                dark
              >
                {{ item.colorLine.toUpperCase() }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import camelcase from 'camelcase'
import { Component, Vue, Watch } from 'vue-property-decorator'

import { fiveMinutes, getClubByValue, getColorLineColorByValue, getFullname, getGradeByValue, isCordova } from '@/const'
import { createCSV } from '@/lib/csv'
import { cubbiesSectionsCompleted, cubbiesTotalSections } from '@/lib/cubbies'
import { sparksSegmentsCompleted, sparksTotalSegmentsRequirementsPerPass } from '@/lib/sparks'
import { tntSectionsCompleted, tntTotalSections } from '@/lib/tnt'
import { vxm } from '@/store'

const tableName = 'directorClubbersList'

@Component
export default class extends Vue {
  loading = false
  tableState = {
    search: '',
    options: {} as DataTableOptions
  }

  readonly isCordova = isCordova
  readonly colorLineHack = 'item.colorLine'
  readonly getColorLineColorByValue = getColorLineColorByValue

  get headers () {
    let headers = [
      { text: 'Name', value: 'fullName' },
      { text: 'Grade', value: 'gradeName', groupable: true },
      { text: 'Completion (%)', value: 'percentageCompleted', groupable: true }
    ]

    if (vxm.user.club === 'b') {
      headers = [
        ...headers.slice(0, 2),
        { text: 'Color', value: 'colorLine', groupable: true },
        ...headers.slice(2)
      ]
    }

    return headers
  }

  get clubName () {
    return getClubByValue(vxm.user.club)
  }

  get clubbersList () {
    return vxm.clubbers.clubbersList
      .filter(record => record.clubber.club === vxm.user.club)
      .map(record => {
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
          ...record.clubber,
          fullName: getFullname(record.clubber),
          gradeName: getGradeByValue(record.clubber.grade),
          percentageCompleted
        }
      }
      )
  }

  getLeaderName (leader?: string) {
    return (typeof leader !== 'undefined' && vxm.appUsers.users[leader]) ? getFullname(vxm.appUsers.users[leader]) : ''
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
    await vxm.appUsers.getAppUsers()
    this.loading = false
  }

  editClubber (clubberRecord: ClubberRecord) {
    this.$router.push({ name: 'DirectorClubberEdit', params: { cid: clubberRecord.cid } })
  }

  download () {
    const club = camelcase(this.clubName.replace('\'', '').replace('&', ' and '), { pascalCase: true })
    const data = this.clubbersList.map((clubber) => ({
      'First Name': clubber.firstName,
      'Last Name': clubber.lastName,
      Club: clubber.club,
      Birthday: clubber.birthday,
      Gender: clubber.gender,
      Grade: clubber.grade,
      'Color Line': clubber.colorLine,
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
