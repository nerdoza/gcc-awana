<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Remove Clubber Parent</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-list-item>
      <v-list-item-avatar color="grey lighten-2">
        <v-icon>$user</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-text="parent.fullName"></v-list-item-title>
        <v-list-item-subtitle v-text="parent.phoneNumber"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>
      This will remove this user's access to this clubber's information.
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

@Component
export default class extends Vue {
  @Prop() readonly parent!: {fullName: string, phoneNumber: string}

  confirmRemove () {
    this.remove()
    this.close()
  }

  @Emit()
  remove () {
    return this.parent.phoneNumber
  }

  @Emit()
  close () {
    return null
  }
}
</script>
