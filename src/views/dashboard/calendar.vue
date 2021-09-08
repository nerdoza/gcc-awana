<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" align-self="start">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Fall 2021</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" v-for="(month, index) in fallMonths" :key="index">
                <v-card>
                  <v-card-title class="pb-1" v-text="month"></v-card-title>
                  <v-list>
                    <v-list-item v-for="(date, index) in dates[month]" :key="index">
                      <v-list-item-avatar>
                        <v-avatar
                          :color="isNextClub(date.date) ? 'orange' : date.noClub ? 'grey' : 'primary'"
                        >
                          <span class="white--text headline" v-text="date.day"></span>
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="date.title === '' ? fallDefaultTitle  : date.title"
                          :class="{'font-weight-bold': date.title !== '' , 'grey--text': date.noClub}"
                        ></v-list-item-title>
                        <v-list-item-subtitle v-if="date.noClub">No Club</v-list-item-subtitle>
                        <v-list-item-subtitle v-else-if="date.subText">{{ date.subText }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" sm="10" md="8" lg="6" xl="4" align-self="start">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Spring 2022</v-toolbar-title>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" v-for="(month, index) in springMonths" :key="index">
                <v-card>
                  <v-card-title class="pb-1" v-text="month"></v-card-title>
                  <v-list>
                    <v-list-item v-for="(date, index) in dates[month]" :key="index">
                      <v-list-item-avatar>
                        <v-avatar :color="date.noClub ? 'grey' : 'primary'">
                          <span class="white--text headline" v-text="date.day"></span>
                        </v-avatar>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="date.title === '' ? springDefaultTitle  : date.title"
                          :class="{'font-weight-bold': date.title !== '', 'grey--text': date.noClub}"
                        ></v-list-item-title>
                        <v-list-item-subtitle v-if="date.noClub">No Club</v-list-item-subtitle>
                        <v-list-item-subtitle v-else-if="date.subText">{{ date.subText }}</v-list-item-subtitle>
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
import { Component, Vue } from 'vue-property-decorator'

import { getDates, isNextClub } from '@/lib/calendar'

@Component
export default class extends Vue {
  readonly fallDefaultTitle = 'Regular Club'
  readonly fallMonths = ['September', 'October', 'November', 'December']

  readonly springDefaultTitle = 'Regular Club'
  readonly springMonths = ['January', 'February', 'March', 'April', 'May']

  readonly isNextClub = isNextClub

  readonly dates = getDates()
}
</script>
