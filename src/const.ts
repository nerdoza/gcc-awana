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

export const getFullname = (u: {firstName: string, lastName: string}) => u.firstName + ' ' + u.lastName

export const getRoleSnippet = (userRole?: UserRole) => {
  if (typeof userRole === 'undefined') {
    return 'Parent'
  }

  const club = getClubByValue(userRole.club)

  if (userRole.director) {
    return (club === '' ? 'General' : club) + ' Director'
  }

  if (userRole.leader) {
    return (club === '' ? 'Floating' : club) + ' Leader'
  }

  if (userRole.admin) {
    return 'Administrator'
  }

  return 'Parent'
}

export const getClubByValue = (value: string) => {
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

export const ClubSelect = [
  { text: 'General', value: '' },
  { text: 'Puggles', value: 'p' },
  { text: 'Cubbies', value: 'c' },
  { text: 'Sparks', value: 's' },
  { text: 'Boy\'s T&T', value: 'b' },
  { text: 'Girl\'s T&T', value: 'g' }
]
