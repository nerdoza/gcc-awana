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
            <v-icon class="fa-fw">$calendar</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Weekly Updates</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'ParentTools' }">
          <v-list-item-icon>
            <v-icon class="fa-fw">$homeHeart</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Parent Tools</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

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

          <v-list-item :to="{ name: 'DirectorClubbers' }">
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

      <v-dialog max-width="420">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>$info</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Help</v-card-title>
          <v-card-text class="pb-0">
            <p>This app is created and supported by the Awana Directors at Grace Community Church. We will do our best to help you with any questions or issues you have.</p>
            <p>
              <strong>Grace Community Church</strong>
              <br />
              <a href="tel:1-559-733-3966">+1 (559) 733-3966</a>
            </p>
            <p>
              <router-link :to="{ name: 'Terms' }">Terms &amp; Conditions</router-link>
              <br />
              <router-link :to="{ name: 'Privacy' }">Privacy Policy</router-link>
            </p>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="pl-4 text-caption" @click="aboutTapped">App Version: {{appVersion}}</div>
          </v-card-actions>
          <v-img
            v-if="aboutTap >= 10"
            src="~@/assets/images/easterEggs/asa.jpg"
            contain
            aspect-ratio="0.75"
            class="px-4"
          ></v-img>
        </v-card>
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

import Notification from '@/components/notification.vue'
import { vxm } from '@/store'

@Component({
  components: {
    Notification
  }
})
export default class extends Vue {
  appVersion = process.env.VUE_APP_VERSION ?? ''
  drawer = false
  aboutTap = 0

  user = vxm.user

  get title () {
    return this.$store.state.route.meta.title
  }

  aboutTapped () {
    this.aboutTap++
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
