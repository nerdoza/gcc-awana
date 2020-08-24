<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Notifications</v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="createNotification">
              <v-icon>$addNotification</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container class="pt-0">
            <v-row>
              <v-col cols="12" v-for="(record, index) in notificationsList" :key="index">
                <v-card>
                  <v-card-title class="headline" v-text="record.notification.title"></v-card-title>
                  <v-card-subtitle
                    v-if="record.notification.sentAt"
                  >Sent on {{getTimeString(record.notification.sentAt)}}</v-card-subtitle>
                  <v-card-subtitle
                    v-else
                  >Draft created on {{getTimeString(record.notification.createdAt)}}</v-card-subtitle>

                  <v-card-text v-text="record.notification.text"></v-card-text>

                  <v-card-actions v-if="!record.notification.sentAt">
                    <v-btn class="primary" @click="edit(record.nid)">Edit</v-btn>
                  </v-card-actions>
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

import { getTimeString, oneHour } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  readonly getTimeString = getTimeString

  loading = false

  get notificationsList () {
    return vxm.notifications.notificationsList.sort((a, b) => {
      if (typeof a.notification.sentAt === 'undefined') {
        if (typeof b.notification.sentAt === 'undefined') {
          if (a.notification.createdAt === b.notification.createdAt) {
            return 0
          }
          return a.notification.createdAt > b.notification.createdAt ? -1 : 1
        }
        return -1
      } else {
        if (typeof b.notification.sentAt === 'undefined') {
          return 1
        }
        if (a.notification.sentAt === b.notification.sentAt) {
          return 0
        }
        return a.notification.sentAt > b.notification.sentAt ? -1 : 1
      }
    })
  }

  async mounted () {
    if (vxm.notifications.sinceUpdate > oneHour) {
      await this.refreshData()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.notifications.getNotifications()
    this.loading = false
  }

  async createNotification () {
    this.$router.push({ name: 'NotificationCreate' })
  }

  edit (nid: string) {
    this.$router.push({ name: 'NotificationEdit', params: { nid } })
  }
}
</script>
