<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card tile class="elevation-12" id="app-user-edit-view">
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Edit App User</v-toolbar-title>
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
                <div class="display-1">{{ fullName }}</div>
                <div class="headline">{{ roleSnippet }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <v-hover v-slot:default="{ hover }">
                  <v-list-item @click="call" @mouseover="color = 'primary'">
                    <v-list-item-action>
                      <v-icon :color="hover ? 'primary':  ''">$call</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="user.phoneNumber"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-hover>
                <v-hover v-slot:default="{ hover }">
                  <v-list-item @click="email">
                    <v-list-item-action color="grey lighten-2">
                      <v-icon :color="hover ? 'primary':  ''">$send</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="user.email"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-hover>
              </v-col>
            </v-row>
          </v-container>
          <v-divider></v-divider>
          <v-subheader>Roles</v-subheader>
          <v-container class="pt-0">
            <v-row>
              <v-col cols="12" sm="6" class="py-0">
                <v-switch v-model="role.leader" label="Leader"></v-switch>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <v-select :items="clubSelect" v-model="role.club" label="Club"></v-select>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <v-switch v-model="role.director" label="Director"></v-switch>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <v-switch v-model="role.admin" label="Administrator"></v-switch>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <v-switch v-model="role.super" :disabled="isCurrentSuper" label="Super User"></v-switch>
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

import { clubSelect, getFullname, getRoleSnippet } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly uid!: string

  loading = false
  user = { ...vxm.appUsers.users[this.uid] }
  role = { ...vxm.appUsers.roles[this.uid] }

  readonly clubSelect = [{ text: 'General', value: '' }, ...clubSelect]

  get fullName () {
    return getFullname(this.user)
  }

  get roleSnippet () {
    return getRoleSnippet(this.role)
  }

  get isCurrentSuper () {
    return this.uid === vxm.user.uid
  }

  async refreshData () {
    this.loading = true
    await vxm.appUsers.getAppUser({ uid: this.uid })
    this.user = { ...vxm.appUsers.users[this.uid] }
    this.role = { ...vxm.appUsers.roles[this.uid] }
    this.loading = false
  }

  call () {
    window.location.href = 'tel:' + this.user.phoneNumber
  }

  email () {
    window.location.href = 'mailto:' + this.user.email
  }

  @Watch('role', { deep: true })
  async onRoleChanged (role: UserRole) {
    await vxm.appUsers.updateRole({ uid: this.uid, role: { ...role } })
  }

  close () {
    this.$router.go(-1)
  }
}
</script>

<style lang="scss">
#app-user-edit-view {
  .v-input--switch .v-messages {
    min-height: 0;
  }
}
</style>
