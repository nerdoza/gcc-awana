import './registerServiceWorker'
import './plugins/veeValidate'
import './plugins/firebase'
import './filters'

import Vue from 'vue'

import App from './app.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const ignoredMessage = 'The .native modifier for v-on is only valid on components but it was used on <svg>.'
Vue.config.warnHandler = (message, vm, componentTrace) => {
  if (message !== ignoredMessage) {
    // eslint-disable-next-line no-console
    console.error(message + componentTrace)
  }
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
