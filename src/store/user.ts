import { action, createModule, mutation } from 'vuex-class-component'

import firebaseProject, { User } from '@/plugins/firebase'

export default class extends createModule({ namespaced: 'user', strict: false }) {
  firstName = ''
  lastName = ''
  email = ''

  get fullName () {
    return this.firstName + ' ' + this.lastName
  }

  get isEmpty () {
    return this.firstName === '' && this.lastName === ''
  }

  get isValid () {
    return this.firstName.length > 0 &&
     this.lastName.length > 0
  }

  @action
  async setProfile () {
    try {
      console.log('Pushing Profile Update')
      await firebaseProject.updateUserName(this.firstName + ' ' + this.lastName)
      await firebaseProject.updateUserEmail(this.email)
    } catch (error) {
      console.error(error)
    }
  }

  @mutation
  setFromUser (user: User) {
    this.firstName = user.name?.split(' ')[0] ?? ''
    this.lastName = user.name?.split(' ')[1] ?? ''
    this.email = user.email ?? ''
  }

  @mutation
  clear () {
    this.firstName = ''
    this.lastName = ''
    this.email = ''
  }
}
