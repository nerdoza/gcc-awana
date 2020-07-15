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
$radius: 0.5rem;

* {
  scrollbar-width: thin;
  scrollbar-color: black white;
}

*::-webkit-scrollbar {
  width: $radius;
  height: $radius;
}

*::-webkit-scrollbar-track {
  border-radius: $radius;
  background: black;
}

*::-webkit-scrollbar-thumb {
  border-radius: $radius;
  background-color: white;
}
</style>
