import { Location } from 'vue-router'
import { action, createModule, mutation } from 'vuex-class-component'

import { firestoreCollections, phoneNumberRegex } from '@/const'
import firebaseProject from '@/plugins/firebase'
import router from '@/router'
import { vxm } from '@/store'

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

  get needsAllClubbers () {
    return this.admin || this.director || this.super
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
    this._setAuth({ authenticated: true, user })

    await this.getProfile()
    await this.getRoles()

    if (!alreadyAuthorized) {
      await router.push(this.defaultRoute)
    }
  }

  @action
  async getRoles () {
    const role = await firebaseProject.getDocument(this.uid, firestoreCollections.userRoles) as UserRole | undefined
    this._setRole(role)
  }

  @action
  async userSignedOut () {
    const alreadyAuthorized = this.authenticated
    this._setAuth({ authenticated: false })

    void this.dispose()
    void vxm.appUsers.dispose()
    void vxm.clubbers.dispose()
    void vxm.notifications.dispose()
    void vxm.system.dispose()
    void vxm.updates.dispose()

    if (alreadyAuthorized) {
      await router.push(this.defaultRoute)
    }
  }

  @action
  async getProfile () {
    const user = await firebaseProject.getDocument(this.uid, firestoreCollections.users) as User | undefined
    if (typeof user !== 'undefined') {
      this._setProfile(user)
    }
  }

  @action
  async setProfile () {
    await this.updateDBProfile()

    try {
      await firebaseProject.updateUserEmail(this.email)
      await firebaseProject.updateUserName(this.firstName + ' ' + this.lastName)
    } catch (error) { }
  }

  @action
  async updateDBProfile () {
    await firebaseProject.setDocument(this.uid, firestoreCollections.users, {
      phoneNumber: this.phoneNumber,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    })
  }

  @action
  async clearPhoneNumber () {
    this._clearPhoneNumber()
  }

  @action
  async dispose () {
    this._clear()
  }

  @mutation
  private _clearPhoneNumber () {
    this.phoneNumber = ''
  }

  @mutation
  private _clear () {
    this.uid = ''
    this.firstName = ''
    this.lastName = ''
    this.email = ''
    this.phoneNumber = ''
  }

  @mutation
  private _setProfile ({ firstName, lastName, email }: User) {
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
  }

  @mutation
  private _setAuth (params: {authenticated: boolean, user?: AuthUser}) {
    this.authenticated = params.authenticated

    if (params.authenticated && typeof params.user !== 'undefined') {
      this.uid = params.user.uid
      this.phoneNumber = strippedToFormattedPhoneNumber(params.user?.phoneNumber ?? '')
    } else if (!params.authenticated) {
      this.uid = ''
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.phoneNumber = ''
    }
  }

  @mutation
  private _setRole (role?: UserRole) {
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
