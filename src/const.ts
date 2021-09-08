export const isCordova = typeof process.env.CORDOVA_PLATFORM !== 'undefined'
export const isAndroid = process.env.CORDOVA_PLATFORM === 'android'
export const isIOS = process.env.CORDOVA_PLATFORM === 'ios'
export const isElectron = typeof process.env.IS_ELECTRON !== 'undefined'
export const isWeb = !isCordova && !isElectron

export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
