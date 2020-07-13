<template>
  <v-app>
    <v-main>
      <v-container fluid class="fill-height">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {

}
</script>

<style lang="scss">
html {
  overflow-y: hidden;
}
</style>
