import { Location } from 'vue-router'
import { action, createModule, mutation } from 'vuex-class-component'

import { firestoreCollections, phoneNumberRegex } from '@/const'
import firebaseProject from '@/plugins/firebase'
import router from '@/router'

let verificationConfirmation: ((code: string) => Promise<void>) | undefined
const strippedToFormattedPhoneNumber = (number: string | null) => {
  if (number !== null && number !== '') {
    const cleaned = number.replace(/\D+/g, '')
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match !== null) {
      return ['+', match[1], ' (', match[2], ') ', match[3], '-', match[4]].join('')
    }
  }
  return ''
}

export default class extends createModule({ namespaced: 'user', strict: false }) {
  authenticated: boolean = false
  uid = ''
  phoneNumber =''
  firstName = ''
  lastName = ''
  email = ''
  leader = false
  club: Club = '' as Club.None
  admin = false
  director = false
  super = false

  get fullName () {
    return this.firstName + ' ' + this.lastName
  }

  get strippedPhoneNumber () {
    if (this.phoneNumber === null) {
      return null
    }

    return '+' + this.phoneNumber.replace(/\D+/g, '')
  }

  get userIsEmpty () {
    return this.firstName === '' && this.lastName === ''
  }

  get userIsValid () {
    return this.firstName.length > 0 &&
     this.lastName.length > 0
  }

  get phoneNumberIsValid () {
    return this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)
  }

  get defaultRoute () {
    const route: Location = { name: '' }
    if (!this.authenticated) {
      route.name = 'AuthStart'
      return route
    }

    if (this.userIsEmpty) {
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
    await firebaseProject.signOut()
    await this.userSignedOut()
  }

  @action
  async userSignedIn (user: AuthUser) {
    const alreadyAuthorized = this.authenticated
    this.setAuth({ authenticated: true, user })

    if (!alreadyAuthorized) {
      await router.push(this.defaultRoute)
    }

    void this.getRoles()
    void this.updateDBProfile()
  }

  @action
  async getRoles () {
    const role = await firebaseProject.getDocument(this.uid, firestoreCollections.userRoles) as UserRole | undefined
    this.setRole(role)
  }

  @action
  async userSignedOut () {
    const alreadyAuthorized = this.authenticated
    this.setAuth({ authenticated: false })

    if (alreadyAuthorized) {
      await router.push(this.defaultRoute)
    }
  }

  @action
  async setProfile () {
    await firebaseProject.updateUserName(this.firstName + ' ' + this.lastName)
    await firebaseProject.updateUserEmail(this.email)
    await this.updateDBProfile()
  }

  @action
  async updateDBProfile () {
    await firebaseProject.setDocument(this.uid, firestoreCollections.users, {
      phoneNumber: this.phoneNumber,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      updatedAt: (new Date()).toISOString()
    })
  }

  @mutation
  clearPhoneNumber () {
    this.phoneNumber = ''
  }

  @mutation
  clear () {
    this.authenticated = false
    this.uid = ''
    this.firstName = ''
    this.lastName = ''
    this.email = ''
  }

  @mutation
  setAuth (params: {authenticated: boolean, user?: AuthUser}) {
    this.authenticated = params.authenticated
    this.uid = params.user?.uid ?? ''
    this.phoneNumber = strippedToFormattedPhoneNumber(params.user?.phoneNumber ?? '')

    if (params.authenticated && typeof params.user !== 'undefined') {
      this.uid = params.user.uid
      this.firstName = params.user.name?.split(' ')[0] ?? ''
      this.lastName = params.user.name?.split(' ')[1] ?? ''
      this.email = params.user.email ?? ''
    } else {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
    }
  }

  @mutation
  setRole (role?: UserRole) {
    if (typeof role !== 'undefined') {
      this.leader = role.leader
      this.club = role.club
      this.admin = role.admin
      this.director = role.director
      this.super = role.super
    } else {
      this.leader = false
      this.club = '' as Club.None
      this.admin = false
      this.director = false
      this.super = false
    }
  }
}
