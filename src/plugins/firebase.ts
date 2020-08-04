/* eslint-disable simple-import-sort/sort */
import { isCordova } from '@/const'

import * as firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

import { vxm } from '@/store'

class FirebaseX {
  private readonly firebaseJS?: firebase.app.App | undefined

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
      document.addEventListener('deviceready', () => {
        void this.attemptSignIn()
        void this.setupNotifications()
      }, false)
    }
  }

  get firebaseCordova () {
    return window.FirebasePlugin
  }

  async signOut () {
    if (!isCordova) {
      await this.firebaseJS?.auth().signOut()
    } else {
      try {
        await new Promise((resolve, reject) => {
          this.firebaseCordova.signOutUser(() => resolve(), (error: string) => reject(new Error(error)))
        })
      } catch (error) { }
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
      await new Promise((resolve, reject) => {
        this.firebaseCordova.isUserSignedIn(async (isSignedIn: boolean) => {
          if (isSignedIn) {
            await vxm.auth.userSignedIn()
          } else {
            await vxm.auth.userSignedOut()
          }
          resolve()
        }, (error: string) => reject(new Error(error)))
      })
    }
  }

  setupNotifications () {
    if (isCordova) {
      this.firebaseCordova.grantPermission(() => {})

      this.firebaseCordova.onMessageReceived((message: {title: string, body: string}) => {
        vxm.notification.push({ title: message.title, message: message.body })
      })
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

  async verifyPhoneNumber (phoneNumber: string, elementId: string, options: {timeout: number, fakeVerificationCode?: string} = { timeout: 120 }) {
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
          await confirmationResult.confirm(code)
        }
      }
    } else {
      const resolve: (code: string) => Promise<void> = await new Promise((resolve, reject) => {
        this.firebaseCordova.verifyPhoneNumber((credential: {instantVerification: boolean, id: string, verificationId: string, code?: string}) => {
          if (credential.instantVerification) {
            this.firebaseCordova.signInWithCredential(credential, async () => {
              await vxm.auth.userSignedIn()
              resolve(async (code: string) => { })
            }, (error: string) => reject(new Error(error)))
          } else {
            resolve(async (code: string) => {
              await new Promise((resolve, reject) => {
                credential.code = code
                this.firebaseCordova.signInWithCredential(credential, () => resolve(), (error: string) => reject(new Error(error)))
              })
            })
          }
        }, (error: string) => reject(new Error(error)), phoneNumber, options.timeout, options?.fakeVerificationCode)
      })
      return resolve
    }
  }
}

const firebaseProject = new FirebaseX()

export default firebaseProject
