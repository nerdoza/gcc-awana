import { Location } from 'vue-router'
import { action, createModule, mutation } from 'vuex-class-component'

import { phoneNumberRegex } from '@/const'
import firebaseProject from '@/plugins/firebase'
import router from '@/router'
import { vxm } from '@/store'

let verificationConfirmation: ((code: string) => Promise<void>) | undefined

export default class extends createModule({ namespaced: 'auth', strict: false }) {
  authenticated: boolean = false
  phoneNumber: string | null = null

  get isValidPhoneNumber () {
    return this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)
  }

  get defaultRoute () {
    const route: Location = { name: '' }
    if (!this.authenticated) {
      route.name = 'AuthStart'
      return route
    }

    if (vxm.registration.step < 6) {
      route.name = 'Registration'
      route.params = { step: vxm.registration.step.toString() }
    } else {
      route.name = 'Payment'
    }
    return route
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
    await this.userSignedOut()
  }

  @action
  async userSignedIn () {
    if (!this.authenticated) {
      this.setAuthenticated(true)
      await router.push(this.defaultRoute)
    }
  }

  @action
  async userSignedOut () {
    if (this.authenticated) {
      this.setAuthenticated(false)
      await router.push(this.defaultRoute)
    }
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
