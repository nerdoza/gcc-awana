import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'

import RegistrationStore from './registration'

Vue.use(Vuex)

const store = new Store({
  modules: {
    ...extractVuexModule(RegistrationStore)
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store

export const vxm = {
  registration: createProxy(store, RegistrationStore)
}
