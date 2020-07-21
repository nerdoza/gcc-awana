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

export const zipCodeRegex = new RegExp(/^\d{5}$/)
export const zipCodeMask = '#####'

export const dateOfBirthRegex = new RegExp(/^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d/)
export const dateOfBirthISORegex = new RegExp(/^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/)
export const dateOfBirthMask = '##/##/####'

export type gendersType = 'm' | 'f' | null
export const genders = [
  { text: 'Male', value: 'm' },
  { text: 'Female', value: 'f' }
]
export type gradesType = 'p' | 'k' | '1' | '2' | '3' | '4' | '5' | '6' | null
export const grades = [
  { text: 'Pre', value: 'p' },
  { text: 'K', value: 'k' },
  { text: '1st', value: '1' },
  { text: '2nd', value: '2' },
  { text: '3rd', value: '3' },
  { text: '4th', value: '4' },
  { text: '5th', value: '5' },
  { text: '6th', value: '6' }
]
export type clubsType = 'p' | 'c' | 's' | 't' | null
export const clubs = [
  { text: 'No Preference', value: null },
  { text: 'Puggles', value: 'p' },
  { text: 'Cubbies', value: 'c' },
  { text: 'Sparks', value: 's' },
  { text: 'T&T', value: 't' }
]
export const states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']

export const getCurrentSchoolYear = () => {
  const currentYear = (new Date()).getFullYear()
  const currentMonth = (new Date()).getMonth()
  return currentMonth < 5 ? currentYear - 1 : currentYear
}

export const schoolStartDate = () => {
  return new Date(getCurrentSchoolYear().toString() + '-09-01')
}
