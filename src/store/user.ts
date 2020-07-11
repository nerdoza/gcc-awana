import { createModule, mutation } from 'vuex-class-component'

export default class UserStore extends createModule({ namespaced: 'user', strict: false }) {
  firstname = 'Michael'
  lastname = 'Olofinjana'
  specialty = 'JavaScript'

  @mutation clearName () {
    this.firstname = ''
    this.lastname = ''
  }

  get fullname () {
    return this.firstname + ' ' + this.lastname
  }

  set fullname (name: string) {
    const names = name.split(' ')
    this.firstname = names[0]
    this.lastname = names[1]
  }

  get bio () {
    return `Name: ${this.fullname} Specialty: ${this.specialty}`
  }
}
