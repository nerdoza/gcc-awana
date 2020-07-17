import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'
import VuexPersistence from 'vuex-persist'

import { isDevelopment } from '@/const'

import RegistrationStore, { ChildRegistration, ChildSerializedState } from './registration'

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  strictMode: isDevelopment,
  key: isDevelopment ? 'vuex-v1-dev' : 'vuex-v1-prod',
  storage: window.localStorage,
  restoreState: (key: string) => {
    const serializedState = window.localStorage.getItem(key)
    const state = typeof serializedState === 'string' ? JSON.parse(serializedState) : {}
    if (typeof state?.registration?.childRegistrations?.children !== 'undefined') {
      state.registration.childRegistrations.children = state.registration.childRegistrations.children.map((child: ChildSerializedState) => new ChildRegistration(child))
    }
    return state
  }
})

const store = new Store({
  modules: {
    ...extractVuexModule(RegistrationStore)
  },
  mutations: {
    RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
  },
  strict: isDevelopment,
  plugins: [vuexPersist.plugin]
})

export default store

export const vxm = {
  registration: createProxy(store, RegistrationStore)
}
