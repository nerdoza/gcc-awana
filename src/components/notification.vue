<template>
  <v-snackbar v-model="open" :timeout="timeout" :top="true">
    <strong>{{ notification.title }}</strong>
    <br />
    {{ notification.message }}
    <template v-slot:action="{ attrs }">
      <v-btn color="primary" text v-bind="attrs" @click="open = false">
        <v-icon>$close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { vxm } from '@/store'

@Component
export default class extends Vue {
  readonly timeout = 20000

  get notification () {
    return vxm.notification
  }

  set open (value: boolean) {
    if (!value) {
      vxm.notification.clear()
    }
  }

  get open () {
    return !vxm.notification.isEmpty
  }
}
</script>
