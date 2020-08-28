<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Fall 2020 - At Home</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" v-for="(month, index) in fallMonths" :key="index">
                <v-card>
                  <v-card-title class="pb-1" v-text="month"></v-card-title>
                  <v-list>
                    <v-list-item v-for="(date, index) in fallDates[month]" :key="index">
                      <v-list-item-avatar>
                        <v-avatar
                          :color="isNextClub(date.date) ? 'amber' : date.noClub ? 'grey' : 'primary'"
                        >
                          <span class="white--text headline" v-text="date.day"></span>
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="date.title"
                          :class="{'font-weight-bold': date.title !== fallDefaultTitle, 'grey--text': date.noClub}"
                        ></v-list-item-title>
                        <v-list-item-subtitle v-if="date.noClub">No Club</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Spring 2021 - In Person</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" v-for="(month, index) in springMonths" :key="index">
                <v-card>
                  <v-card-title class="pb-1" v-text="month"></v-card-title>
                  <v-list>
                    <v-list-item v-for="(date, index) in springDates[month]" :key="index">
                      <v-list-item-avatar>
                        <v-avatar :color="date.noClub ? 'grey' : 'primary'">
                          <span class="white--text headline" v-text="date.day"></span>
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="date.title"
                          :class="{'font-weight-bold': date.title !== springDefaultTitle, 'grey--text': date.noClub}"
                        ></v-list-item-title>
                        <v-list-item-subtitle v-if="date.noClub">No Club</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
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
import { add, differenceInDays, format, isBefore, isFuture, isSameDay, parse } from 'date-fns'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  readonly fallStart = parse('09/09/2020', 'MM/dd/yyyy', new Date())
  readonly fallEnd = parse('12/30/2020', 'MM/dd/yyyy', new Date())

  readonly fallUniqueDates: {[index:string]: {title: string, noClub?: true}} = {
    '09/09/2020': { title: 'Drive-Thru Book Pick-Up' },
    '11/25/2020': { title: 'Thanksgiving Break', noClub: true },
    '12/23/2020': { title: 'Christmas Break', noClub: true },
    '12/30/2020': { title: 'Christmas Break', noClub: true }
  }

  readonly fallDefaultTitle = 'On-Line Club'
  readonly fallMonths = ['September', 'October', 'November', 'December']

  get fallDates () {
    const months: {[index:string]: {date: Date, day: string, title: string, noClub?: true}[]} = { September: [], October: [], November: [], December: [] }
    for (let date = this.fallStart; isBefore(date, add(this.fallEnd, { weeks: 1 })); date = add(date, { weeks: 1 })) {
      const formattedDate = format(date, 'MM/dd/yyyy')
      const day = format(date, 'd')
      const month = format(date, 'MMMM')
      if (this.fallUniqueDates[formattedDate]) {
        months[month].push({ date, day, ...this.fallUniqueDates[formattedDate] })
      } else {
        months[month].push({ date, day, title: this.fallDefaultTitle })
      }
    }
    return months
  }

  readonly springStart = parse('01/06/2021', 'MM/dd/yyyy', new Date())
  readonly springEnd = parse('5/12/2021', 'MM/dd/yyyy', new Date())

  readonly springUniqueDates: {[index:string]: {title: string, noClub?: true}} = {
    '01/06/2021': { title: 'Christmas Break', noClub: true },
    '03/31/2021': { title: 'Easter Break', noClub: true },
    '05/12/2021': { title: 'Award Night' }
  }

  readonly springDefaultTitle = 'Regular Club'
  readonly springMonths = ['January', 'February', 'March', 'April', 'May']

  get springDates () {
    const months: {[index:string]: {date: Date, day: string, title: string, noClub?: true}[]} = { January: [], February: [], March: [], April: [], May: [] }
    for (let date = this.springStart; isBefore(date, add(this.springEnd, { weeks: 1 })); date = add(date, { weeks: 1 })) {
      const formattedDate = format(date, 'MM/dd/yyyy')
      const day = format(date, 'd')
      const month = format(date, 'MMMM')
      if (this.springUniqueDates[formattedDate]) {
        months[month].push({ date, day, ...this.springUniqueDates[formattedDate] })
      } else {
        months[month].push({ date, day, title: this.springDefaultTitle })
      }
    }
    return months
  }

  isNextClub (date: Date) {
    const today = new Date()
    if (isSameDay(date, this.fallStart) && isFuture(date)) {
      return true
    }
    const diff = differenceInDays(date, today)
    return diff >= 0 && diff < 7
  }
}
</script>
