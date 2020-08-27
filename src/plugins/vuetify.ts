import { library } from '@fortawesome/fontawesome-svg-core'
import { faBellOn, faBellPlus, faBookUser, faCalendarAlt, faCalendarPlus, faChalkboardTeacher, faChild, faCloudUploadAlt, faEdit, faFileDownload, faHomeHeart, faKey, faMobileAlt, faPaperPlane, faPhone, faSignOutAlt, faSpinnerThird, faStars, faSync, faTrash, faUserPlus, faUsers, faUsersClass, faUsersCog, faUserSlash, faVideo, faWhistle } from '@fortawesome/pro-duotone-svg-icons'
import { faCircle, faDotCircle, faSquare } from '@fortawesome/pro-regular-svg-icons'
import { faArrowLeft, faBars, faCaretDown, faCheck, faCheckSquare, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faMinus, faPaperclip, faPlus, faQuestion, faSearch, faTimes, faTimesCircle, faUser } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faSync, faSpinnerThird, faTimesCircle, faPaperclip, faMinus, faCloudUploadAlt, faChalkboardTeacher, faFileDownload, faUsers, faSearch, faChevronUp, faChevronDown, faArrowLeft, faUsersCog, faBookUser, faVideo, faTimes, faWhistle, faCalendarAlt, faUsersClass, faUser, faBars, faStars, faEdit, faUserPlus, faSignOutAlt, faKey, faMobileAlt, faTrash, faCaretDown, faCheck, faQuestion, faChevronLeft, faChevronRight, faSquare, faCheckSquare, faCircle, faDotCircle, faHomeHeart, faPhone, faUserSlash, faPlus, faPaperPlane, faChild, faBellOn, faBellPlus, faCalendarPlus)

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
      clubbers: icon('fad', 'users-class'),
      calendar: icon('fad', 'calendar-alt'),
      calendarAdd: icon('fad', 'calendar-plus'),
      director: icon('fad', 'whistle'),
      video: icon('fad', 'video'),
      close: icon('fas', 'times'),
      admin: icon('fad', 'book-user'),
      left: icon('fas', 'arrow-left'),
      superUser: icon('fad', 'users-cog'),
      search: icon('fas', 'search'),
      users: icon('fad', 'users'),
      download: icon('fad', 'file-download'),
      leader: icon('fad', 'chalkboard-teacher'),
      import: icon('fad', 'cloud-upload-alt'),
      spinner: icon('fad', 'spinner-third'),
      sync: icon('fad', 'sync'),
      call: icon('fad', 'phone'),
      removeUser: icon('fad', 'user-slash'),
      plus: icon('fas', 'plus'),
      send: icon('fad', 'paper-plane'),
      child: icon('fad', 'child'),
      notification: icon('fad', 'bell-on'),
      addNotification: icon('fad', 'bell-plus')
    }
  }
})
