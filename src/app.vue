<template>
  <v-app>
    <v-main>
      <transition name="slide">
        <router-view></router-view>
      </transition>
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
$transition-timing: 0.3s;

.v-application--wrap {
  background-image: url("~@/assets/background.jpg");
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
}

.no-label .v-label {
  display: none;
}

.dark-label .v-label {
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-stepper__step__step .v-icon.v-icon.fa-check {
  font-size: 1rem;
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

.slide-leave-active {
  transition-property: transform, opacity;
  transition-duration: $transition-timing;
}

.slide-leave {
  opacity: 100;
  transform: translateX(0);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20%);
}

.slide-enter-active {
  transition-property: transform, opacity;
  transition-duration: $transition-timing;
  transition-delay: $transition-timing/2;
}

.slide-enter {
  opacity: 0;
  transform: translateX(20%);
}

.slide-enter-to {
  opacity: 100;
  transform: translateX(0);
}
</style>
