export const isCordova = typeof process.env.CORDOVA_PLATFORM !== 'undefined'
export const isAndroid = process.env.CORDOVA_PLATFORM === 'android'
export const isIOS = process.env.CORDOVA_PLATFORM === 'ios'
export const isElectron = typeof process.env.IS_ELECTRON !== 'undefined'
export const isWeb = !isCordova && !isElectron

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'

export const phoneNumberRegex = new RegExp(/^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/)
export const phoneNumberMask = '+1 (###) ###-####'

export const verificationCodeRegex = new RegExp(/^\d{4}$/)
export const verificationCodeMask = '####'

export const zipCodeRegex = new RegExp(/^\d{5}$/)
export const zipCodeMask = '#####'

export const dateOfBirthRegex = new RegExp(/^\d{2}\/\d{2}\/\d{4}/)
export const dateOfBirthISORegex = new RegExp(/^\d{4}-\d{2}-\d{2}/)
export const dateOfBirthMask = '##/##/####'

export const genders = ['Male', 'Female']
export const grade = ['Pre', 'K', '1', '2', '3', '4', '5', '6']
export const clubs = ['Puggles', 'Cubbies', 'Sparks', 'T&T']
export const states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']

export const getCurrentSchoolYear = () => {
  const currentYear = (new Date()).getFullYear()
  const currentMonth = (new Date()).getMonth()
  return currentMonth < 5 ? currentYear - 1 : currentYear
}

export const schoolStartDate = () => {
  return new Date(getCurrentSchoolYear().toString() + '-09-01')
}
