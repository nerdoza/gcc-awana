import { library } from '@fortawesome/fontawesome-svg-core'
import { faMobileAlt } from '@fortawesome/pro-duotone-svg-icons'
import { faQuestion } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faMobileAlt, faQuestion)

Vue.use(Vuetify)

const icon = (...args: string[]) => ({
  component: FontAwesomeIcon,
  props: {
    icon: args
  }
})

export default new Vuetify({
  theme: {
    dark: false
  },
  icons: {
    iconfont: 'faSvg',
    values: {
      info: icon('fas', 'question'),
      phone: icon('fad', 'mobile-alt')
    }
  }
})
