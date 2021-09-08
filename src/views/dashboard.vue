<template>
  <v-app class="dashboard">
    <v-navigation-drawer v-model="drawer" width="320" app temporary>
      <v-list nav>
        <v-list-item :to="{ name: 'Calendar' }">
          <v-list-item-icon>
            <v-icon class="fa-fw">$calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Club Calendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-btn tile block dark large color="primary" @click="drawer = false">
          <v-icon left dark>$left</v-icon>Close
        </v-btn>
      </template>
    </v-navigation-drawer>

    <v-app-bar id="app-nav" app dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-dialog max-width="420" v-model="help">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>$info</v-icon>
          </v-btn>
        </template>
        <help-card v-on:close="help = false" />
      </v-dialog>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-slide-x-transition leave-absolute hide-on-leave>
          <router-view ref="router"></router-view>
        </v-slide-x-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import HelpCard from '@/components/cards/helpCard.vue'

@Component({
  components: {
    HelpCard
  }
})
export default class extends Vue {
  drawer = false
  help = false

  get title () {
    return this.$router.currentRoute.meta.title
  }
}
</script>

<style lang="scss">
.dashboard {
  .v-app-bar.v-app-bar--fixed {
    height: auto !important;
    padding-top: env(safe-area-inset-top);
  }

  .v-main {
    margin-top: env(safe-area-inset-top) !important;
  }

  .v-navigation-drawer__content {
    padding-top: env(safe-area-inset-top) !important;
  }
}
</style>
