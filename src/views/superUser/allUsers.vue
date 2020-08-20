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
                  <v-text-field v-model="search" append-icon="$search" label="Search"></v-text-field>
                </v-col>
              </v-row>
            </template>
            <template v-else>
              <v-text-field v-model="search" append-icon="$search" label="Search"></v-text-field>
            </template>
          </v-card-text>
          <v-data-table
            :headers="headers"
            :items="usersList"
            :search="search"
            :items-per-page="15"
            @click:row="editUser"
            :loading="loading"
            loading-text="Loading Users..."
            class="clickable"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="userDialog" max-width="700px" transition="dialog-bottom-transition">
      <edit-user-role v-if="userDialog" :user="focusUser" v-on:close="userDialog = false"></edit-user-role>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import EditUserRole from '@/components/cards/editUserCard.vue'
import { firestoreCollections, getFullname, getRoleSnippet, isCordova } from '@/const'
import { createCSV } from '@/lib/csv'
import firebaseProject from '@/plugins/firebase'

@Component({
  components: {
    EditUserRole
  }
})
export default class extends Vue {
  users: {[index: string]: CombinedUser} = {}
  loading = false
  search = ''
  userDialog = false
  focusUser : null | {uid: string, user: CombinedUser} = null

  readonly isCordova = isCordova

  readonly headers = [
    { text: 'Name', value: 'user.fullName', groupable: false },
    { text: 'Role', value: 'user.roleSnippet', groupable: true }
  ]

  get usersList () {
    return Object.keys(this.users).map(uid => ({
      uid,
      user: {
        ...this.users[uid],
        fullName: getFullname(this.users[uid]),
        roleSnippet: getRoleSnippet(this.users[uid].role)
      }
    }))
  }

  async mounted () {
    await this.refreshData()
  }

  async refreshData () {
    this.loading = true
    const combinedUser: {[index: string]: CombinedUser} = {}
    const users = await firebaseProject.getCollection(firestoreCollections.users) as {[index: string]: User}
    const userRoles = await firebaseProject.getCollection(firestoreCollections.userRoles) as {[index: string]: UserRole}
    Object.keys(users).forEach(uid => {
      combinedUser[uid] = {
        ...users[uid],
        role: userRoles[uid] ?? {
          leader: false,
          club: '',
          admin: false,
          director: false,
          super: false
        }
      }
    })

    this.users = combinedUser
    this.loading = false
  }

  editUser (user: {uid: string, user: CombinedUser}) {
    this.focusUser = user
    this.userDialog = true
  }

  download () {
    const data = Object.keys(this.users).map(uid => ({
      'First Name': this.users[uid].firstName,
      'Last Name': this.users[uid].lastName,
      Phone: this.users[uid].phoneNumber,
      Email: this.users[uid].email,
      Role: getRoleSnippet(this.users[uid].role)
    }))

    createCSV(data, 'app_users.csv')
  }
}
</script>
