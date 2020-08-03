<template>
  <transition name="slide">
    <router-view></router-view>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { isCordova } from '@/const'

@Component
export default class extends Vue {
  mounted () {
    if (isCordova) {
      setTimeout(() => navigator.splashscreen.hide(), 2000)
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/global.scss";
</style>
