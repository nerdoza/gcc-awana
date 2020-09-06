<template>
  <v-container class="pa-0"></v-container>
</template>

<script lang="ts">
import { format, parse } from 'date-fns'
import { Component, Prop, Vue } from 'vue-property-decorator'

import {  } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: TnTBook}
}
</script>
