import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faExternalLinkAlt)

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true
  },
  icons: {
    iconfont: 'faSvg',
    values: {
      open: {
        component: FontAwesomeIcon,
        props: {
          icon: ['fas', 'external-link-alt']
        }
      }
    }
  }
})
