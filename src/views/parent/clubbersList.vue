<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" v-for="(record, index) in clubbersList" :key="index">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title v-text="record.clubberMeta.fullName"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="openClubber(record.cid)">
              <v-icon>$right</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <template v-if="record.book.type === 't'">
              <p>T&amp;T</p>
            </template>
            <template v-if="record.book.type === 's'">
              <p>{{ record.bookMeta.sectionLabel }}</p>
              <v-item-group multiple>
                <v-container>
                  <v-row>
                    <v-col v-for="n in record.bookMeta.sectionSize" :key="n" cols="6" sm="3">
                      <v-item v-slot:default="{ active, toggle }">
                        <v-card
                          :color="active ? 'primary' : ''"
                          class="d-flex align-center"
                          dark
                          height="100"
                          :disabled="record.bookMeta.nextSectionSegment < n"
                          @click="toggle"
                        >
                          <div class="flex-grow-1 text-center">
                            Memory Section {{ n }}
                            <div v-if="active" class="caption">Completed</div>
                          </div>
                        </v-card>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-item-group>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ImportClubber from '@/components/cards/importClubbersCard.vue'
import { fiveMinutes, getClubByValue, getFullname, getGradeByValue, getSparksFocusSection, getSparksSectionLabel, sparksBookRequirements } from '@/const'
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
      .map(record => {
        const newRecord = {
          cid: record.cid,
          clubber: {
            ...record.clubber
          },
          clubberMeta: {
            fullName: getFullname(record.clubber),
            gradeName: getGradeByValue(record.clubber.grade),
            clubName: getClubByValue(record.clubber.club)
          },
          book: {
            ...record.book
          },
          bookMeta: {}
        }

        if (record.book.type === 's') {
          const book = record.book as SparksBook
          const section = getSparksFocusSection(book)
          newRecord.bookMeta = {
            section,
            sectionLabel: getSparksSectionLabel(section),
            sectionSize: sparksBookRequirements[section],
            nextSectionSegment: (Array.isArray(book[section]) ? (book[section] as string[]).length : 0) + 1
          }
        }

        return newRecord
      })
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
