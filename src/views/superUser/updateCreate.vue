<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create Update</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-row justify="center">
              <v-date-picker
                v-model="date"
                :allowed-dates="allowedDates"
                class="mt-4"
                :min="minDate"
                :max="maxDate"
                event-color="primary"
                dark
              ></v-date-picker>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              class="mr-2 mb-2"
              :disabled="!isValid || creating"
              :loading="creating"
              @click="createUpdate"
            >
              <v-icon class="mr-2">$addWeeklyUpdate</v-icon>Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { add, endOfYesterday, format, isSameMonth, isThursday, parse } from 'date-fns'
import { Component, Vue } from 'vue-property-decorator'

import { lastDay } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  creating = false

  date = ''

  get isValid () {
    return this.date !== ''
  }

  get title () {
    return format(this.postAtDate, 'MMM do') + ' - ' + format(this.postAtDatePeriod, isSameMonth(this.postAtDate, this.postAtDatePeriod) ? 'do' : 'MMM do')
  }

  get postAtDate () {
    return parse(this.date + ' 02:00', 'yyyy-MM-dd kk:mm', new Date())
  }

  get postAtDatePeriod () {
    // To-Do: test this (Should generate 7 day window for title)
    return add(this.postAtDate, { days: 6 })
  }

  get postAt () {
    return this.postAtDate.valueOf()
  }

  get minDate () {
    return endOfYesterday().toISOString()
  }

  get maxDate () {
    return lastDay.toISOString()
  }

  get unavailableDates () {
    return vxm.updates.updatesList.map(record => format(new Date(record.update.postAt), 'yyyy-MM-dd'))
  }

  allowedDates (date: string) {
    return !this.unavailableDates.includes(date) && isThursday(parse(date, 'yyyy-MM-dd', new Date()))
  }

  async createUpdate () {
    if (this.isValid) {
      this.creating = true
      const uid = await vxm.updates.createUpdate({ title: this.title, postAt: this.postAt })
      this.$router.replace({ name: 'SuperUpdateEdit', params: { uid } })
    }
  }

  close () {
    this.$router.go(-1)
  }
}
</script>
