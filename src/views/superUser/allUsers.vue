<template>
  <v-container fluid class="all-users-list fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-card-title>
            App Users
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="$search"
              label="Search"
              hide-details
              single-line
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="usersList"
            :search="search"
            :items-per-page="15"
            @click:row="editUser"
            :loading="loading"
            loading-text="Loading Users..."
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
import { CombinedUser, getFullname, getRoleSnippet, User, UserRole } from '@/const'
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

  readonly headers = [
    { text: 'Name', value: 'user.fullName' },
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
    const users = await firebaseProject.getCollection('users') as {[index: string]: User}
    const userRoles = await firebaseProject.getCollection('userRoles') as {[index: string]: UserRole}
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
    this.userDialog = true
    this.focusUser = user
  }
}
</script>

<style lang="scss">
.all-users-list {
  tr:hover,
  tr:active,
  tr:focus {
    cursor: pointer;
  }
}
</style>
