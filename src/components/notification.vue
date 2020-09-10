<template>
  <v-snackbar v-model="open" :timeout="timeout" :top="true">
    <strong>{{ title }}</strong>
    <br />
    {{ message }}
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

  get title () {
    return vxm.system.notification?.title ?? ''
  }

  get message () {
    return vxm.system.notification?.message ?? ''
  }

  set open (value: boolean) {
    if (!value) {
      void vxm.system.clearNotification()
    }
  }

  get open () {
    return vxm.system.notificationAvailable
  }
}
</script>
