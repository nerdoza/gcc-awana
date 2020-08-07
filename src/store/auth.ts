import { Location } from 'vue-router'
import { action, createModule, mutation } from 'vuex-class-component'

import { phoneNumberRegex } from '@/const'
import firebaseProject, { User } from '@/plugins/firebase'
import router from '@/router'
import { vxm } from '@/store'

let verificationConfirmation: ((code: string) => Promise<void>) | undefined
const strippedToFormattedPhoneNumber = (number: string | null) => {
  if (number !== null) {
    const cleaned = number.replace(/\D+/g, '')
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match !== null) {
      return ['+', match[1], ' (', match[2], ') ', match[3], '-', match[4]].join('')
    }
  }
  return null
}

export default class extends createModule({ namespaced: 'auth', strict: false }) {
  authenticated: boolean = false
  uid: string | null = null
  phoneNumber: string | null = null

  get strippedPhoneNumber () {
    if (this.phoneNumber === null) {
      return null
    }

    return '+' + this.phoneNumber.replace(/\D+/g, '')
  }

  get isValidPhoneNumber () {
    return this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)
  }

  get defaultRoute () {
    const route: Location = { name: '' }
    if (!this.authenticated) {
      route.name = 'AuthStart'
      return route
    }

    if (vxm.user.isEmpty) {
      route.name = 'SignUp'
    } else {
      route.name = 'Updates'
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
      const user = await firebaseProject.getCurrentUser()
      await this.userSignedIn(user)
    } else {
      throw new Error('auth/unknown-verification-request')
    }
  }

  @action
  async signOut () {
    await vxm.user.clear()
    await firebaseProject.signOut()
    await this.userSignedOut()
  }

  @action
  async userSignedIn (user: User) {
    const alreadyAuthorized = this.authenticated
    this.setAuth({ authenticated: true, user })

    if (!alreadyAuthorized) {
      await router.push(this.defaultRoute)
    }
  }

  @action
  async userSignedOut () {
    const alreadyAuthorized = this.authenticated
    this.setAuth({ authenticated: false })

    if (alreadyAuthorized) {
      await router.push(this.defaultRoute)
    }
  }

  @mutation
  clearPhoneNumber () {
    this.phoneNumber = null
  }

  @mutation
  clear () {
    this.phoneNumber = null
    this.uid = null
    this.authenticated = false
  }

  @mutation
  setAuth (params: {authenticated: boolean, user?: User}) {
    this.authenticated = params.authenticated
    this.uid = params.user?.uid ?? null
    this.phoneNumber = strippedToFormattedPhoneNumber(params.user?.phoneNumber ?? null)

    if (typeof params.user !== 'undefined') {
      vxm.user.setFromUser(params.user)
    } else {
      vxm.user.clear()
    }
  }
}
