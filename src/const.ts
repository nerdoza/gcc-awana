import { differenceInYears, format, parse } from 'date-fns'
import decamelize from 'decamelize'

import cubbiesImg from '@/assets/images/cubbies.png'
import gccImg from '@/assets/images/gcc_arms.png'
import sparksImg from '@/assets/images/sparks.png'
import tntImg from '@/assets/images/tnt.png'

export const isCordova = typeof process.env.CORDOVA_PLATFORM !== 'undefined'
export const isAndroid = process.env.CORDOVA_PLATFORM === 'android'
export const isIOS = process.env.CORDOVA_PLATFORM === 'ios'
export const isElectron = typeof process.env.IS_ELECTRON !== 'undefined'
export const isWeb = !isCordova && !isElectron

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

export const phoneNumberRegex = new RegExp(/^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/)
export const phoneNumberMask = '+1 (###) ###-####'

export const verificationCodeRegex = new RegExp(/^\d{6}$/)
export const verificationCodeMask = '######'

export const birthdayRegex = new RegExp(/^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/)
export const birthdayMask = '##/##/####'

export const oneMinute = 60000
export const fiveMinutes = 300000
export const oneHour = 3600000
export const oneMonth = 2592000000

export const debounceSaveTimeout = 2000

export const lastDay = parse('06/30/2021', 'MM/dd/yyyy', new Date())

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, '')
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match !== null) {
    return ['+1 ', '(', match[2], ') ', match[3], '-', match[4]].join('')
  }
}

export const getCurrentSchoolYear = () => {
  const currentYear = (new Date()).getFullYear()
  const currentMonth = (new Date()).getMonth()
  return currentMonth < 5 ? currentYear - 1 : currentYear
}

export const getSchoolStartDate = () => {
  return parse((getCurrentSchoolYear().toString() + '-09-01'), 'yyyy-MM-dd', new Date())
}

export const getAgeAsOf = (birthday: string, asOfDate: Date) => {
  return differenceInYears(asOfDate, parse(birthday, 'MM/dd/yyyy', new Date()))
}

export const getAgeAsOfSchoolStart = (birthday: string) => {
  return getAgeAsOf(birthday, getSchoolStartDate())
}

export const getTimeString = (time: number) => {
  return format(time, 'M/dd/yy \'at\' h:mm aaaa')
}

export const getClubColor = (club: Club) => {
  switch (club) {
    case 'c':
      return 'light-green lighten-3'
    case 's':
      return 'amber lighten-3'
    case 'b':
    case 'g':
      return 'blue lighten-3'
  }
  return 'green darken-3'
}

export const getClubImg = (club: Club) => {
  switch (club) {
    case 'c':
      return cubbiesImg
    case 's':
      return sparksImg
    case 'b':
    case 'g':
      return tntImg
  }
  return gccImg
}

export const getGradeByAge = (age: number) => {
  if (age < 5) {
    return 'p'
  } else if (age < 6) {
    return 'k'
  } else if (age < 7) {
    return '1'
  } else if (age < 8) {
    return '2'
  } else if (age < 9) {
    return '3'
  } else if (age < 10) {
    return '4'
  } else if (age < 11) {
    return '5'
  }
  return '6'
}

export const getClubByGrade = (grade: Grade, age: number, gender: Gender) => {
  switch (grade) {
    case 'p':
      if (age < 3) {
        return 'p'
      } else if (age < 5) {
        return 'c'
      } else {
        return 's'
      }
    case 'k':
    case '1':
    case '2':
      return 's'
    case '3':
    case '4':
    case '5':
    case '6':
      return gender === 'f' ? 'g' : 'b'
    default:
      return ''
  }
}

export const getFullname = (u: {firstName: string, lastName: string}) => u.firstName + ' ' + u.lastName

export const getRoleSnippet = (userRole?: UserRole) => {
  if (typeof userRole === 'undefined') {
    return 'Parent'
  }

  const club = getClubByValue(userRole.club)

  if (userRole.director) {
    return (club === '' ? 'Commander' : club + ' Director')
  }

  if (userRole.leader) {
    return (club === '' ? 'Floating' : club) + ' Leader'
  }

  if (userRole.admin) {
    return 'Administrator'
  }

  return 'Parent'
}

export const getClubByValue = (value: Club) => {
  switch (value) {
    case 'p':
      return 'Puggles'
    case 'c':
      return 'Cubbies'
    case 's':
      return 'Sparks'
    case 'b':
      return 'Boy\'s T&T'
    case 'g':
      return 'Girl\'s T&T'
  }
  return ''
}

export const getBookTypeByValue = (value: Club) => {
  if (value === 'g' || value === 'b') {
    return 't'
  }
  return value as 't' | 'p' | 'c' | 's'
}

export const getGradeByValue = (value: Grade) => {
  switch (value) {
    case 'p':
      return 'Pre'
    case 'k':
      return 'K'
    case '1':
      return '1st'
    case '2':
      return '2nd'
    case '3':
      return '3rd'
    case '4':
      return '4th'
    case '5':
      return '5th'
    case '6':
      return '6th'
  }
  return ''
}

export const clubs = ['p', 'c', 's', 'b', 'g']

export const clubSelect = [
  { text: 'Puggles', value: 'p' },
  { text: 'Cubbies', value: 'c' },
  { text: 'Sparks', value: 's' },
  { text: 'Boy\'s T&T', value: 'b' },
  { text: 'Girl\'s T&T', value: 'g' }
]

export const genderSelect = [
  { text: 'Male', value: 'm' },
  { text: 'Female', value: 'f' }
]

export const gradeSelect = [
  { text: 'Pre', value: 'p' },
  { text: 'K', value: 'k' },
  { text: '1st', value: '1' },
  { text: '2nd', value: '2' },
  { text: '3rd', value: '3' },
  { text: '4th', value: '4' },
  { text: '5th', value: '5' },
  { text: '6th', value: '6' }
]

export const firestoreCollections = {
  users: 'users',
  userRoles: 'userRoles',
  clubbers: 'clubbers',
  clubberBooks: 'clubberBooks',
  notifications: 'notifications',
  configs: 'configs',
  updates: 'updates'
}

export const sparksBookRequirements: {[index: string]: number} = {
  flight: 4,
  rankTest: 8,
  redJewel1: 4,
  greenJewel1: 4,
  redJewel2: 4,
  greenJewel2: 4,
  redJewel3: 4,
  greenJewel3: 4,
  redJewel4: 4,
  greenJewel4: 4,
  rankTestReview: 8,
  redJewel1Review: 4,
  greenJewel1Review: 4,
  redJewel2Review: 4,
  greenJewel2Review: 4,
  redJewel3Review: 4,
  greenJewel3Review: 4,
  redJewel4Review: 4,
  greenJewel4Review: 4
}

export const sparksBookSectionOrder: Array<keyof SparksBook> = [
  'rankTest',
  'redJewel1',
  'greenJewel1',
  'redJewel2',
  'greenJewel2',
  'redJewel3',
  'greenJewel3',
  'redJewel4',
  'greenJewel4',
  'rankTestReview',
  'redJewel1Review',
  'greenJewel1Review',
  'redJewel2Review',
  'greenJewel2Review',
  'redJewel3Review',
  'greenJewel3Review',
  'redJewel4Review',
  'greenJewel4Review'
]

export const getSparksFocusSection: (book: SparksBook) => keyof SparksBook = (book: SparksBook) => {
  if ((typeof book.skipFlight === 'undefined' || book.skipFlight === false) && book.flight?.length !== sparksBookRequirements.flight) {
    return 'flight'
  }

  let newSection: keyof SparksBook | undefined
  sparksBookSectionOrder.forEach(section => {
    const bookSection = book[section]
    if (typeof newSection === 'undefined' && (typeof bookSection === 'undefined' || (Array.isArray(bookSection) && bookSection.length !== sparksBookRequirements[section]))) {
      newSection = section
    }
  })

  if (typeof newSection === 'undefined') {
    newSection = 'completed'
  }

  return newSection
}

export const getSparksSectionLabel = (section: keyof SparksBook) => {
  return decamelize(section, ' ').split(' ').map(seg => seg[0].toUpperCase() + seg.slice(1)).join(' ')
}
