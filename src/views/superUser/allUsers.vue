<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-card-title>
            Users
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
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { getClubByValue } from '@/const'
import firebaseProject, { User, UserRole } from '@/plugins/firebase'

interface CombinedUser extends User {
  role: UserRole
}

const getFullname = (user: CombinedUser) => user.firstName + ' ' + user.lastName

const getRoleSnippet = (user: CombinedUser) => {
  if (typeof user.role === 'undefined') {
    return 'Parent'
  }

  const club = getClubByValue(user.role.club)

  if (user.role.director) {
    return (club === '' ? 'General' : club + ' ') + 'Director'
  }

  if (user.role.admin) {
    return 'Administrator'
  }

  if (user.role.leader) {
    return (club === '' ? 'Floating' : club) + ' Leader'
  }
}

@Component
export default class extends Vue {
  users: {[index: string]: CombinedUser} = {}
  search = ''

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
        roleSnippet: getRoleSnippet(this.users[uid])
      }
    }))
  }

  async mounted () {
    await this.refreshData()
  }

  async refreshData () {
    const combinedUser: {[index: string]: CombinedUser} = {}
    const users = await firebaseProject.getCollection('users') as {[index: string]: User}
    const userRoles = await firebaseProject.getCollection('userRoles') as {[index: string]: UserRole}
    Object.keys(users).forEach(uid => {
      combinedUser[uid] = {
        ...users[uid],
        role: userRoles[uid]
      }
    })

    this.users = combinedUser
  }

  editUser ({ uid }: {uid: string, user: CombinedUser}) {
    console.log(uid)
  }
}
</script>
