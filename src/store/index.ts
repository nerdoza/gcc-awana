import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'
import VuexPersistence from 'vuex-persist'

import { isDevelopment } from '@/const'

import UserStore from './user'

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  strictMode: isDevelopment,
  key: isDevelopment ? 'vuex-v2-dev' : 'vuex-v2-prod',
  storage: window.localStorage,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reducer: (state: any) => ({
    user: state.user
  })
})

const store = new Store({
  modules: {
    ...extractVuexModule(UserStore)
  },
  actions: {},
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
  },
  strict: isDevelopment,
  plugins: [vuexPersist.plugin]
})

export default store

export const vxm = {
  user: createProxy(store, UserStore)
}
