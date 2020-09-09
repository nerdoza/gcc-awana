<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>App Users</v-toolbar-title>
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
            :items="usersList"
            :items-per-page="15"
            :search="tableState.search"
            :options.sync="tableState.options"
            @click:row="editUser"
            :loading="loading"
            loading-text="Loading Users..."
            class="clickable"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import { fiveMinutes, getFullname, getRoleSnippet, isCordova } from '@/const'
import { createCSV } from '@/lib/csv'
import { vxm } from '@/store'

const tableName = 'appUserList'

@Component
export default class extends Vue {
  loading = false
  tableState = {
    search: '',
    options: {} as DataTableOptions
  }

  readonly isCordova = isCordova

  readonly headers = [
    { text: 'Name', value: 'user.fullName', groupable: false },
    { text: 'Role', value: 'role.roleSnippet', groupable: true }
  ]

  get usersList () {
    return vxm.appUsers.usersList.map(appUser => ({
      uid: appUser.uid,
      user: { ...appUser.user, fullName: getFullname(appUser.user) },
      role: { ...appUser.role, roleSnippet: getRoleSnippet(appUser.role) }
    }))
  }

  async mounted () {
    const tableState = vxm.system.dataTableState[tableName]
    if (typeof tableState !== 'undefined') {
      this.tableState = { search: tableState.search, options: { ...tableState.options } }
    }

    if (vxm.appUsers.sinceUpdate > fiveMinutes) {
      await this.refreshData()
    }
  }

  async refreshData () {
    this.loading = true
    await vxm.appUsers.getAppUsers()
    this.loading = false
  }

  editUser (appUser: AppUser) {
    this.$router.push({ name: 'AppUserEdit', params: { uid: appUser.uid } })
  }

  download () {
    const data = this.usersList.map(appUser => ({
      'First Name': appUser.user.firstName,
      'Last Name': appUser.user.lastName,
      Phone: appUser.user.phoneNumber,
      Email: appUser.user.email,
      Role: appUser.role.roleSnippet
    }))

    createCSV(data, 'app_users.csv')
  }

  @Watch('tableState', { deep: true })
  onTableStateChange (tableState: { options: DataTableOptions, search: string}) {
    vxm.system.setDataTableState({ tableName, state: { ...tableState } })
  }
}
</script>
