<template>
  <v-app class="dashboard">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon>$user</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ user.fullName }}</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>$calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Weekly Updates</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>$homeHeart</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Parent Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon>$students</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Leader Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar id="app-nav" app dark flat color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>GCC AWANA Club</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>$stars</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { vxm } from '@/store'

@Component
export default class extends Vue {
  drawer = false

  user = vxm.user
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
