<template>
  <v-container class="clubber-parent-details pa-0 pb-4">
    <v-expansion-panels flat accordion>
      <v-expansion-panel>
        <v-expansion-panel-header class="text-h5 pa-0">Parent Details</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col v-for="(parent, index) in parents" :key="index" cols="12" md="6">
              <v-card>
                <v-card-title class="pb-0">{{ getFullname(parent) }}</v-card-title>
                <v-card-actions>
                  <v-list class="pa-0" width="100%">
                    <v-hover v-slot:default="{ hover }">
                      <v-list-item @click="call(parent.phoneNumber)" @mouseover="color = 'primary'">
                        <v-list-item-action>
                          <v-icon :color="hover ? 'primary':  ''">$call</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title v-text="parent.phoneNumber"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-hover>
                    <v-hover v-slot:default="{ hover }">
                      <v-list-item @click="email(parent.email)">
                        <v-list-item-action color="grey lighten-2">
                          <v-icon :color="hover ? 'primary':  ''">$send</v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                          <v-list-item-title v-text="parent.email"></v-list-item-title>
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

import { getFullname, oneHour } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  readonly getFullname = getFullname

  get parents () {
    return vxm.appUsers.usersList.filter(parentRecord => this.record.clubber.parents?.includes(parentRecord.user.phoneNumber)).map(appUser => appUser.user) ?? []
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
