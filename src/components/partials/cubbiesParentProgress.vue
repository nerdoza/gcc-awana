<template>
  <v-container class="cubbies-parent-progress pa-0">
    <v-overlay :value="celebrate" ref="celebrate-root">
      <v-card color="white" class="rounded-circle pa-6 align-center justify-center">
        <v-icon size="90" class="fa-fw" :color="celebrateColor" v-text="celebrateIcon"></v-icon>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { confetti } from 'dom-confetti'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import { } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}
}
</script>

<style lang="scss">
.cubbies-parent-progress {
  .section-steps {
    .v-card--link:focus:before {
      opacity: 0;
    }
  }
}
</style>
