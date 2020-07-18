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
$radius: 0.5rem;

.v-application--wrap {
  background-image: url("~@/assets/background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #00bfa5 #666666;
}

*::-webkit-scrollbar {
  width: $radius;
  height: $radius;
}

*::-webkit-scrollbar-track {
  background: #666666;
}

*::-webkit-scrollbar-thumb {
  border-radius: $radius;
  background-color: #00bfa5;
}
</style>
