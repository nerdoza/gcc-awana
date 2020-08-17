<template>
  <v-card tile class="edit-user-role-card">
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>User</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" class="pb-0">
          <div class="display-1">{{ user.user.fullName }}</div>
          <div class="headline">{{ user.user.roleSnippet }}</div>
        </v-col>
        <v-col cols="12" sm="6" class="pb-0">
          <div>{{ user.user.phoneNumber }}</div>
          <div>{{ user.user.email }}</div>
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <v-switch v-model="user.user.role.leader" label="Leader"></v-switch>
        </v-col>
        <v-col cols="12" sm="6" class="py-0">
          <v-select :items="clubSelect" v-model="user.user.role.club" label="Club"></v-select>
        </v-col>
        <v-col cols="12" sm="4" class="py-0">
          <v-switch v-model="user.user.role.director" label="Director"></v-switch>
        </v-col>
        <v-col cols="12" sm="4" class="py-0">
          <v-switch v-model="user.user.role.admin" label="Administrator"></v-switch>
        </v-col>
        <v-col cols="12" sm="4" class="py-0">
          <v-switch v-model="user.user.role.super" :disabled="isCurrentSuper" label="Super User"></v-switch>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { debounce } from 'ts-debounce'
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

import { clubSelect } from '@/const'
import firebaseProject from '@/plugins/firebase'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly user!: {uid: string, user: CombinedUser}
  readonly clubSelect = [{ text: 'General', value: '' }, ...clubSelect]

  readonly debouncedSave = debounce((user) => {
    void firebaseProject.setDocument(this.user.uid, 'userRoles', user.user.role)
  }, 1500)

  get isCurrentSuper () {
    return this.user.uid === vxm.user.uid
  }

  @Watch('user', { deep: true })
  onUserChanged (user: {uid: string, user: CombinedUser}) {
    this.debouncedSave(user)
  }

  @Emit()
  close () {
    return undefined
  }
}
</script>

<style lang="scss">
.edit-user-role-card {
  .v-input--switch .v-messages {
    min-height: 0;
  }
}
</style>
