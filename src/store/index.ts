import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { createProxy, extractVuexModule } from 'vuex-class-component'

import UserStore from './user'

Vue.use(Vuex)

const store = new Store({
  modules: {
    ...extractVuexModule(UserStore)
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store

export const vxm = {
  user: createProxy(store, UserStore)
}
