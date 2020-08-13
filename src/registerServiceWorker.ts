/* eslint-disable no-console */
import { register } from 'register-service-worker'

import { isProduction, isWeb } from '@/const'

if (isWeb && isProduction) {
  const baseUrl = (process.env.BASE_URL ?? './')

  register(`${baseUrl}sw.js`, {
    ready () {
      if (!isProduction) {
        console.log(
          'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
        )
      }
    },
    registered () {
      if (!isProduction) {
        console.log('Service worker has been registered.')
      }
    },
    cached () {
      if (!isProduction) {
        console.log('Content has been cached for offline use.')
      }
    },
    updatefound () {
      if (!isProduction) {
        console.log('New content is downloading.')
      }
    },
    updated () {
      if (!isProduction) {
        console.log('New content is available; please refresh.')
      }
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
