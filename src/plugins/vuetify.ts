import { library } from '@fortawesome/fontawesome-svg-core'
import { faKey, faMobileAlt } from '@fortawesome/pro-duotone-svg-icons'
import { faCaretDown, faCheck, faQuestion } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faKey, faMobileAlt, faCaretDown, faCheck, faQuestion)

Vue.use(Vuetify)

const icon = (...args: string[]) => ({
  component: FontAwesomeIcon,
  props: {
    icon: args
  }
})

export default new Vuetify({
  theme: {
    dark: true
  },
  icons: {
    iconfont: 'faSvg',
    values: {
      info: icon('fas', 'question'),
      phone: icon('fad', 'mobile-alt'),
      key: icon('fad', 'key'),
      check: icon('fas', 'check'),
      sort: icon('fas', 'caret-down')
    }
  }
})
