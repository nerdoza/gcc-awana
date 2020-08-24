<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Clubber</v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$left</v-icon>
            </v-btn>
          </v-toolbar>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="headline">{{ fullName }}</div>
                <div>{{ clubber.birthday }}</div>
                <div>Grade: {{ grade }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select label="Leader" v-model="clubber.leader" :items="leaderSelect"></v-select>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-subheader>Parents</v-subheader>
          <v-container class="pt-0">
            <v-row>
              <v-col cols="12" sm="6" v-for="(parent, index) in parents" :key="index">
                <v-list-item>
                  <v-hover v-slot:default="{ hover }">
                    <v-list-item-avatar
                      :rounded="false"
                      @click="callParent(parent.phoneNumber)"
                      color="grey lighten-2"
                    >
                      <v-icon color="primary" class="call" v-if="hover">$call</v-icon>
                      <v-icon v-else>$user</v-icon>
                    </v-list-item-avatar>
                  </v-hover>

                  <v-list-item-content>
                    <v-list-item-title v-text="parent.fullName"></v-list-item-title>
                    <v-list-item-subtitle v-text="parent.phoneNumber"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import { getFullname, getGradeByValue, oneHour } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly cid!: string

  loading = false

  clubber = { ...vxm.clubbers.clubbers[this.cid], parents: [...vxm.clubbers.clubbers[this.cid].parents ?? []] }

  get leaderSelect () {
    if (this.clubber.club !== '') {
      return vxm.appUsers.usersList.filter(record => {
        return record.role.leader === true && record.role.club === this.clubber.club
      }).map(record => ({
        value: record.uid,
        text: getFullname(record.user)
      }))
    }
    return []
  }

  get fullName () {
    return getFullname(this.clubber)
  }

  get grade () {
    return getGradeByValue(this.clubber.grade)
  }

  get parents (): {fullName: string, phoneNumber: string}[] {
    if (typeof this.clubber.parents !== 'undefined' && this.clubber.parents.length > 0) {
      return this.clubber.parents.map(phoneNumber => {
        const foundUser = vxm.appUsers.usersList.find(record => record.user.phoneNumber === phoneNumber)
        return { fullName: typeof foundUser !== 'undefined' ? getFullname(foundUser.user) : '', phoneNumber }
      })
    }
    return []
  }

  async refreshData () {
    this.loading = true
    await vxm.clubbers.getClubberRecord({ cid: this.cid })
    this.clubber = { ...vxm.clubbers.clubbers[this.cid], parents: [...vxm.clubbers.clubbers[this.cid].parents ?? []] }
    await vxm.appUsers.getAppUsers()
    this.loading = false
  }

  async mounted () {
    if (vxm.appUsers.sinceUpdate > oneHour) {
      await vxm.appUsers.getAppUsers()
    }
  }

  callParent (number: string) {
    window.location.href = 'tel:' + number
  }

  close () {
    this.$router.go(-1)
  }

    @Watch('clubber', { deep: true })
  async onClubberChanged (clubber: Clubber) {
    await vxm.clubbers.updateClubberRecord({ cid: this.cid, clubber: { ...clubber, parents: [...clubber.parents ?? []] } })
  }
}
</script>
