import * as firebase from 'firebase/app'
import { action, createModule, mutation } from 'vuex-class-component'

import { phoneNumberRegex } from '@/const'
import firebaseProject from '@/plugins/firebase'

let verificationConfirmation: ((code: string) => Promise<firebase.auth.UserCredential>) | undefined

export default class extends createModule({ namespaced: 'auth', strict: false }) {
  phoneNumber: string | null = null
  refreshToken: string | null = null

  get isValidPhoneNumber () {
    return this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)
  }

  @action
  async attemptSignIn () {
    await firebaseProject.attemptSignIn()
  }

  @action
  async clearVerifier (elementId: string) {
    firebaseProject.clearVerifier(elementId)
  }

  @action
  async requestVerification (elementId: string) {
    if (this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)) {
      verificationConfirmation = await firebaseProject.verifyPhoneNumber(this.phoneNumber, elementId)
    }
  }

  @action
  async confirmVerification (code: string) {
    if (typeof verificationConfirmation !== 'undefined') {
      const user = await verificationConfirmation(code)
      console.log(user)
    } else {
      throw new Error('auth/unknown-verification-request')
    }
  }

  @mutation
  setUserFromCredential (credential: firebase.auth.UserCredential) {
    this.refreshToken = credential.user?.refreshToken ?? null
  }
}
