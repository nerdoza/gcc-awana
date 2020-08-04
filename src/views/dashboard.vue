<template>
  <v-app class="dashboard">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="fa-fw">$user</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ user.fullName }}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item :to="{ name: 'Dashboard'}">
          <v-list-item-icon>
            <v-icon class="fa-fw">$calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Weekly Updates</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="fa-fw">$homeHeart</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Parent Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="fa-fw">$students</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Leader Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link>
          <v-list-item-icon>
            <v-icon class="fa-fw">$director</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Director Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar id="app-nav" app dark color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon></v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <notification></notification>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Notification from '@/components/dashboard/notification.vue'
import { vxm } from '@/store'

@Component({
  components: {
    Notification
  }
})
export default class extends Vue {
  drawer = false

  user = vxm.user

  get title () {
    switch (this.$store.state.route.name) {
      case 'Account':
        return 'Account Settings'
      case 'Dashboard':
        return 'Weekly Updates'
      case 'ParentTools':
        return 'Parent Tools'
      case 'LeaderTools':
        return 'Leader Tools'
      case 'DirectorTools':
        return 'Director Tools'
    }
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
