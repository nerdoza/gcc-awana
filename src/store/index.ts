import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'
import VuexPersistence from 'vuex-persist'

import { isDevelopment } from '@/const'

import AuthStore from './auth'
import RegistrationStore, { AdditionalContact, ChildRegistration, ChildSerializedState, ContactUpdate } from './registration'

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
    if (typeof state?.registration?.additionalContacts?.contacts !== 'undefined') {
      state.registration.additionalContacts.contacts = state.registration.additionalContacts.contacts.map((contact: ContactUpdate) => new AdditionalContact(contact))
    }
    return state
  }
})

const store = new Store({
  modules: {
    ...extractVuexModule(AuthStore),
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
  registration: createProxy(store, RegistrationStore),
  auth: createProxy(store, AuthStore)
}
