import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarAlt, faEdit, faHomeHeart, faKey, faMobileAlt, faSignOutAlt, faStars, faTrash, faUserPlus, faUsersClass, faVideo, faWhistle } from '@fortawesome/pro-duotone-svg-icons'
import { faCircle, faDotCircle, faSquare } from '@fortawesome/pro-regular-svg-icons'
import { faBars, faCaretDown, faCheck, faCheckSquare, faChevronLeft, faChevronRight, faQuestion, faUser } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faVideo, faWhistle, faCalendarAlt, faUsersClass, faUser, faBars, faStars, faEdit, faUserPlus, faSignOutAlt, faKey, faMobileAlt, faTrash, faCaretDown, faCheck, faQuestion, faChevronLeft, faChevronRight, faSquare, faCheckSquare, faCircle, faDotCircle, faHomeHeart)

Vue.use(Vuetify)

const icon = (...args: string[]) => ({
  component: FontAwesomeIcon,
  props: {
    icon: args
  }
})

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.teal.accent4,
        secondary: colors.grey.darken1,
        accent: colors.amber.darken2,
        error: colors.red.accent3
      }
    }
  },
  icons: {
    iconfont: 'faSvg',
    values: {
      info: icon('fas', 'question'),
      phone: icon('fad', 'mobile-alt'),
      key: icon('fad', 'key'),
      check: icon('fas', 'check'),
      sort: icon('fas', 'caret-down'),
      trash: icon('fad', 'trash'),
      signOut: icon('fad', 'sign-out-alt'),
      addUser: icon('fad', 'user-plus'),
      edit: icon('fad', 'edit'),
      stars: icon('fad', 'stars'),
      user: icon('fas', 'user'),
      homeHeart: icon('fad', 'home-heart'),
      students: icon('fad', 'users-class'),
      calendar: icon('fad', 'calendar-alt'),
      director: icon('fad', 'whistle'),
      video: icon('fad', 'video')
    }
  }
})
