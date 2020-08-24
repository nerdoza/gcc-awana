<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Remove Clubber</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list-item>
      <v-list-item-avatar color="grey lighten-2">
        <v-icon>$child</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="fullName"></v-list-item-title>
        <v-list-item-subtitle v-text="clubSnippet"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      This will completely remove this clubber from the system and destroy all their data.
      <br />
      <br />Are you sure you want to do this?
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="confirmRemove" class="primary mr-2 mb-2">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

import { getClubByValue, getFullname } from '@/const'

@Component
export default class extends Vue {
  @Prop() readonly clubber!: Clubber

  get fullName () {
    return getFullname(this.clubber)
  }

  get clubSnippet () {
    return getClubByValue(this.clubber.club)
  }

  confirmRemove () {
    this.remove()
    this.close()
  }

  @Emit()
  remove () {
    return null
  }

  @Emit()
  close () {
    return null
  }
}
</script>
