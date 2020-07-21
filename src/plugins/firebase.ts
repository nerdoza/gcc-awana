/* eslint-disable simple-import-sort/sort */
import { isCordova } from '@/const'

import * as firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

import { vxm } from '@/store'

class FirebaseX {
  private readonly firebaseJS?: firebase.app.App | undefined
  private readonly firebaseCordova?: any | undefined

  constructor () {
    if (!isCordova) {
      const firebaseConfig = {
        apiKey: 'AIzaSyCT7Ldrdw-oXekcHymxV6qU0pWvVIHp7Eo',
        authDomain: 'gcc-awana.firebaseapp.com',
        databaseURL: 'https://gcc-awana.firebaseio.com',
        projectId: 'gcc-awana',
        storageBucket: 'gcc-awana.appspot.com',
        messagingSenderId: '994083046541',
        appId: '1:994083046541:web:d08c5a91f182e163624ec4',
        measurementId: 'G-0RHL0D8M8D'
      }
      this.firebaseJS = firebase.initializeApp(firebaseConfig)
      firebase.analytics()
      firebase.auth().useDeviceLanguage()
      void this.attemptSignIn()
    } else {
      this.firebaseCordova = window.FirebasePlugin
    }
  }

  async signOut () {
    if (!isCordova) {
      const res = await this.firebaseJS?.auth().signOut()
      console.log(res)
    } else {
      // Add Cordova Code
    }
  }

  async attemptSignIn () {
    if (!isCordova) {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user !== null) {
          await vxm.auth.userSignedIn()
        } else {
          await vxm.auth.userSignedOut()
        }
      })
    } else {
      // Add Cordova Code
    }
  }

  private readonly recaptchaVerifiers = new Map<string, firebase.auth.RecaptchaVerifier>()

  clearVerifier (elementId: string) {
    const verifier = this.recaptchaVerifiers.get(elementId)
    if (typeof verifier !== 'undefined') {
      verifier.clear()
      this.recaptchaVerifiers.delete(elementId)
    }
  }

  async verifyPhoneNumber (phoneNumber: string, elementId: string, options?: {timeout?: number, fakeVerificationCode?: string}) {
    if (!isCordova) {
      let verifier
      if (this.recaptchaVerifiers.has(elementId)) {
        verifier = this.recaptchaVerifiers.get(elementId)
      } else {
        verifier = new firebase.auth.RecaptchaVerifier(elementId, { size: 'invisible' })
        this.recaptchaVerifiers.set(elementId, verifier)
      }
      if (typeof verifier !== 'undefined') {
        const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, verifier)
        return async (code: string) => {
          return await confirmationResult.confirm(code)
        }
      }
    } else {
      // Add Cordova Code
    }
  }
}

const firebaseProject = new FirebaseX()

export default firebaseProject
