<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-img :src="tntBookImg" contain aspect-ratio="3.06" max-height="100"></v-img>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { tntBookImg } from '@/lib/tnt'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: TnTBook}

  readonly tntBookImg = tntBookImg
}
</script>
