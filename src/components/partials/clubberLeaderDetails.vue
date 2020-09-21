<template>
  <v-container class="clubber-leader-details pa-0 pb-4">
    <v-expansion-panels flat accordion>
      <v-expansion-panel>
        <v-expansion-panel-header class="text-h5 pa-0">Leader Details</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col v-for="(leader, index) in leaders" :key="index" cols="12" md="6">
              <v-card>
                <v-card-title>{{ getFullname(leader.user) }}</v-card-title>
                <v-card-subtitle class="pb-0">{{ getRoleSnippet(leader.role) }}</v-card-subtitle>
                <v-card-actions>
                  <v-list class="pa-0" width="100%">
                    <v-hover v-slot:default="{ hover }">
                      <v-list-item
                        @click="call(leader.user.phoneNumber)"
                        @mouseover="color = 'primary'"
                      >
                        <v-list-item-action>
                          <v-icon :color="hover ? 'primary':  ''">$call</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title v-text="leader.user.phoneNumber"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-hover>
                    <v-hover v-slot:default="{ hover }">
                      <v-list-item @click="email(leader.user.email)">
                        <v-list-item-action color="grey lighten-2">
                          <v-icon :color="hover ? 'primary':  ''">$send</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title v-text="leader.user.email"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-hover>
                  </v-list>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-divider></v-divider>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { getFullname, getRoleSnippet, oneHour } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  readonly getFullname = getFullname
  readonly getRoleSnippet = getRoleSnippet

  get leaders () {
    return vxm.appUsers.usersList.filter(record => {
      return record.uid === this.record.clubber?.leader || (record.role.director === true && record.role.club === this.record.clubber.club)
    }).sort((a, b) => {
      return a.role.director === b.role.director ? 0 : (a.role.director ? 1 : -1)
    })
  }

  async mounted () {
    if (vxm.appUsers.sinceUpdate > oneHour) {
      await vxm.appUsers.getAppUsers()
    }
  }

  call (number: string) {
    window.location.href = 'tel:' + number
  }

  email (email: string) {
    window.location.href = 'mailto:' + email
  }
}
</script>
