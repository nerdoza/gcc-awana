import * as firebase from 'firebase/app'
import { action, createModule, mutation } from 'vuex-class-component'

import { phoneNumberRegex } from '@/const'
import firebaseProject from '@/plugins/firebase'
import router from '@/router'

let verificationConfirmation: ((code: string) => Promise<firebase.auth.UserCredential>) | undefined

export default class extends createModule({ namespaced: 'auth', strict: false }) {
  authenticated: boolean = false
  phoneNumber: string | null = null

  get isValidPhoneNumber () {
    return this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)
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
      await verificationConfirmation(code)
      // To-Do: Handle user data
      await this.userSignedIn()
    } else {
      throw new Error('auth/unknown-verification-request')
    }
  }

  @action
  async signOut () {
    this.clearPhoneNumber()
    await this.$store.dispatch('clear', null, { root: true })
    await firebaseProject.signOut()
    await router.push({ name: 'Landing' })
  }

  @action
  async userSignedIn () {
    this.setAuthenticated(true)
  }

  @action
  async userSignedOut () {
    this.setAuthenticated(false)
  }

  @mutation
  clearPhoneNumber () {
    this.phoneNumber = ''
  }

  @mutation
  setAuthenticated (authenticated: boolean) {
    this.authenticated = authenticated
  }
}
