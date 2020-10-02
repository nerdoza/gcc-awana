import { library } from '@fortawesome/fontawesome-svg-core'
import { faAppleAlt, faAward, faBellOn, faBellPlus, faBible, faBookmark, faBookUser, faCalendarAlt, faChalkboardTeacher, faChild, faCloudUploadAlt, faCommentAltLines, faCommentAltPlus, faEdit, faFileDownload, faGem, faIdCard, faKey, faMedal, faMobileAlt, faMoneyBillWave, faPaperPlane, faPhone, faSignOutAlt, faSpinnerThird, faStars, faSync, faTrash, faUserHardHat, faUserPlus, faUsers, faUsersClass, faUsersCog, faUserSlash, faVideo, faWhistle } from '@fortawesome/pro-duotone-svg-icons'
import { faDotCircle, faSquare } from '@fortawesome/pro-regular-svg-icons'
import { faArrowLeft, faArrowRight, faBars, faCaretDown, faCheck, faCheckSquare, faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faCircle, faEllipsisH, faFastBackward, faHeart, faMapMarkerAlt, faMinus, faPaperclip, faPlus, faQuestion, faSearch, faStar, faTimes, faTimesCircle, faUser } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faSync, faSpinnerThird, faTimesCircle, faPaperclip, faMinus, faCloudUploadAlt, faChalkboardTeacher, faFileDownload, faUsers, faSearch, faChevronUp, faChevronDown, faArrowLeft, faArrowRight, faUsersCog, faBookUser, faVideo, faTimes, faWhistle, faCalendarAlt, faUsersClass, faUser, faBars, faStars, faEdit, faUserPlus, faSignOutAlt, faKey, faMobileAlt, faTrash, faCaretDown, faCheck, faQuestion, faChevronLeft, faChevronRight, faSquare, faCheckSquare, faCircle, faDotCircle, faPhone, faUserSlash, faPlus, faPaperPlane, faChild, faBellOn, faBellPlus, faCommentAltLines, faCommentAltPlus, faAward, faGem, faBible, faBookmark, faMapMarkerAlt, faHeart, faFastBackward, faStar, faEllipsisH, faMedal, faAppleAlt, faUserHardHat, faCircle, faMoneyBillWave, faIdCard)

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
      clubbers: icon('fad', 'users-class'),
      calendar: icon('fad', 'calendar-alt'),
      director: icon('fad', 'whistle'),
      video: icon('fad', 'video'),
      close: icon('fas', 'times'),
      admin: icon('fad', 'book-user'),
      left: icon('fas', 'arrow-left'),
      right: icon('fas', 'arrow-right'),
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
      addNotification: icon('fad', 'bell-plus'),
      weeklyUpdate: icon('fad', 'comment-alt-lines'),
      addWeeklyUpdate: icon('fad', 'comment-alt-plus'),
      award: icon('fad', 'award'),
      gem: icon('fad', 'gem'),
      bible: icon('fad', 'bible'),
      flight: icon('fad', 'paper-plane'),
      bookmark: icon('fad', 'bookmark'),
      marker: icon('fas', 'map-marker-alt'),
      heart: icon('fas', 'heart'),
      review: icon('fas', 'fast-backward'),
      star: icon('fas', 'star'),
      more: icon('fas', 'ellipsis-h'),
      medal: icon('fad', 'medal'),
      apple: icon('fad', 'apple-alt'),
      wip: icon('fad', 'user-hard-hat'),
      buck: icon('fad', 'money-bill-wave'),
      card: icon('fad', 'id-card')
    }
  }
})
