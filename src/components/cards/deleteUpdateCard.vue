<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Delete Update</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="mt-4">
      This will completely delete this update from the system.
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
import { Component, Emit, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
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
