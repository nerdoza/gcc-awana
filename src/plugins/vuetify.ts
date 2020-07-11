import Vue from 'vue'
import Vuetify from 'vuetify'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/pro-solid-svg-icons'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faExternalLinkAlt)

Vue.use(Vuetify)

export default new Vuetify({
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
