import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'
import VuexPersistence from 'vuex-persist'

import { isDevelopment } from '@/const'

import AppUsersStore from './appUsers'
import ClubberStore from './clubbers'
import NotificationStore from './notification'
import UserStore from './user'

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  strictMode: isDevelopment,
  key: isDevelopment ? 'vuex-v1-dev' : 'vuex-v1-prod',
  storage: window.localStorage,
  reducer: (state: any) => ({ user: state.user, appUsers: state.appUsers, clubbers: state.clubbers })
})

const store = new Store({
  modules: {
    ...extractVuexModule(UserStore),
    ...extractVuexModule(AppUsersStore),
    ...extractVuexModule(ClubberStore),
    ...extractVuexModule(NotificationStore)
  },
  actions: {
    clear: async (context: any) => {
      await context.dispatch('user/clear')
    }
  },
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
  },
  strict: isDevelopment,
  plugins: [vuexPersist.plugin]
})

export default store

export const vxm = {
  user: createProxy(store, UserStore),
  appUsers: createProxy(store, AppUsersStore),
  clubbers: createProxy(store, ClubberStore),
  notification: createProxy(store, NotificationStore)
}
