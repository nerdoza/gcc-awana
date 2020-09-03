<template>
  <v-app class="dashboard">
    <v-navigation-drawer v-model="drawer" width="320" app temporary>
      <v-list nav>
        <v-list-item :to="{ name: 'User' }">
          <v-list-item-icon>
            <v-icon class="fa-fw">$user</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ user.fullName }}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item :to="{ name: 'Updates' }">
          <v-list-item-icon>
            <v-icon class="fa-fw">$weeklyUpdate</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Weekly Updates</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'Calendar' }">
          <v-list-item-icon>
            <v-icon class="fa-fw">$calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Club Calendar</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group :value="isDirOpen('Parent')">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="fa-fw">$homeHeart</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Parent Tools</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item :to="{ name: 'ParentClubbersList' }">
            <v-list-item-icon>
              <v-icon class="fa-fw">$child</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>My Clubbers</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item :to="{ name: 'LeaderTools' }" v-if="user.leader">
          <v-list-item-icon>
            <v-icon class="fa-fw">$leader</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Leader Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'AdminTools' }" v-if="user.admin">
          <v-list-item-icon>
            <v-icon class="fa-fw">$admin</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Admin Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group v-if="user.director" :value="isDirOpen('Director')">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="fa-fw">$director</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Director Tools</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item :to="{ name: 'DirectorUpdatesList' }">
            <v-list-item-icon>
              <v-icon class="fa-fw">$weeklyUpdate</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Weekly Updates</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'DirectorClubbersList' }">
            <v-list-item-icon>
              <v-icon class="fa-fw">$clubbers</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Clubber Managment</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-group v-if="user.super" :value="isDirOpen('Super')">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon class="fa-fw">$superUser</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Super User Tools</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item :to="{ name: 'NotificationsList' }">
            <v-list-item-icon>
              <v-icon class="fa-fw">$notification</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Notifications</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'SuperUpdatesList' }">
            <v-list-item-icon>
              <v-icon class="fa-fw">$weeklyUpdate</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Weekly Updates</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'AppUsersList' }">
            <v-list-item-icon>
              <v-icon class="fa-fw">$users</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>App User Managment</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :to="{ name: 'SuperClubbersList' }">
            <v-list-item-icon>
              <v-icon class="fa-fw">$clubbers</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Clubber Managment</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
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
        <router-view ref="router"></router-view>
      </v-container>
    </v-main>
    <notification></notification>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import HelpCard from '@/components/cards/helpCard.vue'
import Notification from '@/components/notification.vue'
import { vxm } from '@/store'

@Component({
  components: {
    Notification,
    HelpCard
  }
})
export default class extends Vue {
  drawer = false
  help = false

  user = vxm.user

  get title () {
    return this.$store.state.route.meta.title
  }

  isDirOpen (dirName: string) {
    return (this.$store.state.route.name as string).startsWith(dirName)
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
