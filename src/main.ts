import './registerServiceWorker'
import './filters'

import Vue from 'vue'

import App from './app.vue'
import { isCordova } from './const'
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

if (isCordova) {
  document.addEventListener('deviceready', () => {
    document.addEventListener('backbutton', function (e) {
      e.preventDefault()
    }, false)
  }, false)
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
