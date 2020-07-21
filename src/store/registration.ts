import { action, createModule, createSubModule, mutation } from 'vuex-class-component'

import { clubsType, gendersType, gradesType, phoneNumberRegex, schoolStartDate, zipCodeRegex } from '@/const'

export default class extends createModule({ namespaced: 'registration', strict: false }) {
  adultRegistration = createSubModule(AdultRegistration)
  childRegistrations = createSubModule(ChildRegistrations)
  additionalContacts = createSubModule(AdditionalContacts)
  volunteer = createSubModule(Volunteer)
  terms = createSubModule(Terms)

  @action
  async clear () {
    this.adultRegistration.clear()
    this.childRegistrations.clear()
    this.additionalContacts.clear()
    this.volunteer.clear()
    this.terms.clear()
  }
}

class AdultRegistration extends createModule({ namespaced: 'adultRegistration', strict: false }) {
  firstName = ''
  lastName = ''
  streetAddress = ''
  city = ''
  state = ''
  zip = ''
  email = ''
  primaryPhone = ''
  altPhone = ''

  get isValid () {
    return this.firstName.length > 0 &&
     this.lastName.length > 0 &&
     this.streetAddress.length > 0 &&
     this.city.length > 0 &&
     zipCodeRegex.test(this.zip) &&
     this.state.length === 2 &&
     this.email.length > 0 &&
     phoneNumberRegex.test(this.primaryPhone) &&
     (this.altPhone.length === 0 || phoneNumberRegex.test(this.altPhone))
  }

  @mutation
  clear () {
    this.firstName = ''
    this.lastName = ''
    this.streetAddress = ''
    this.city = ''
    this.state = ''
    this.zip = ''
    this.email = ''
    this.primaryPhone = ''
    this.altPhone = ''
  }
}

export interface ChildUpdate {
  firstName?: string
  lastName?: string
  dateOfBirth?: Date | null
  gender?: gendersType
  grade?: gradesType
  hasMedical?: boolean
  medical?: string | null
}

export interface ChildSerializedState {
  firstName?: string
  lastName?: string
  dateOfBirth?: string | null
  gender?: gendersType
  grade?: gradesType
  medical?: string | null
}

export class ChildRegistration {
  firstName = ''
  lastName = ''
  dateOfBirth: Date | null = null
  gender: gendersType = null
  grade: gradesType = null
  medical: string | null = null

  constructor (state?: ChildSerializedState) {
    if (typeof state?.firstName !== 'undefined') {
      this.firstName = state.firstName
    }
    if (typeof state?.lastName !== 'undefined') {
      this.lastName = state.lastName
    }
    if (typeof state?.dateOfBirth !== 'undefined' && state.dateOfBirth !== null) {
      this.dateOfBirth = new Date(state.dateOfBirth)
    }
    if (typeof state?.gender !== 'undefined') {
      this.gender = state.gender
    }
    if (typeof state?.grade !== 'undefined') {
      this.grade = state.grade
    }
    if (typeof state?.medical !== 'undefined') {
      this.medical = state.medical
    }
  }

  get hasMedical () {
    return this.medical !== null
  }

  set hasMedical (value: boolean) { }

  get isEmpty () {
    return this.firstName === '' &&
    this.lastName === '' &&
    this.dateOfBirth === null &&
    this.gender === null &&
    this.grade === null &&
    this.medical === null
  }

  get isValid () {
    return this.firstName.length > 0 &&
    this.lastName.length > 0 &&
    this.dateOfBirth !== null &&
    this.gender !== null &&
    (this.medical === null || this.medical !== '') &&
    this.grade !== null
  }

  get formattedDateOfBirth () {
    if (this.dateOfBirth === null) {
      return ''
    }

    const [year, month, day] = this.dateOfBirth.toISOString().substr(0, 10).split('-')
    return `${month}/${day}/${year}`
  }

  get isoDateOfBirth () {
    if (this.dateOfBirth === null) {
      return ''
    }

    return this.dateOfBirth.toISOString().substr(0, 10)
  }

  get club () {
    if (this.dateOfBirth === null) {
      return ''
    }
    const age = this.ageAsOfSchoolStart()
    switch (this.grade) {
      case null:
      case 'p':
        if (age < 3) {
          return 'Puggles'
        } else if (age < 5) {
          return 'Cubbies'
        } else {
          return 'Sparks'
        }
      case 'k':
      case '1':
      case '2':
        return 'Sparks'
      case '3':
      case '4':
      case '5':
      case '6':
        return 'T&T'
      default:
        return ''
    }
  }

  ageAsOf (date: Date) {
    if (this.dateOfBirth === null) {
      return 0
    }
    const msDiff = date.getTime() - this.dateOfBirth.getTime()
    const dateDiff = new Date(msDiff)
    return Math.abs(dateDiff.getUTCFullYear() - 1970)
  }

  ageAsOfSchoolStart () {
    return this.ageAsOf(schoolStartDate())
  }

  update ({ firstName, lastName, dateOfBirth, gender, grade, hasMedical, medical }: ChildUpdate) {
    if (typeof firstName !== 'undefined') {
      this.firstName = firstName.trim()
    }
    if (typeof lastName !== 'undefined') {
      this.lastName = lastName.trim()
    }
    if (typeof dateOfBirth !== 'undefined') {
      this.dateOfBirth = dateOfBirth
    }
    if (typeof gender !== 'undefined') {
      this.gender = gender
    }
    if (typeof grade !== 'undefined') {
      this.grade = grade
    }
    if (typeof hasMedical !== 'undefined') {
      if (hasMedical && this.medical === null) {
        this.medical = ''
      } else if (!hasMedical && this.medical !== null) {
        this.medical = null
      }
    }
    if (typeof medical !== 'undefined') {
      this.medical = medical
      if (typeof medical === 'string') {
        this.medical = medical.trim()
      }
    }

    this.guessGrade()
  }

  private guessGrade () {
    if (this.grade === null && this.dateOfBirth !== null) {
      const age = this.ageAsOfSchoolStart()
      if (age < 5) {
        this.grade = 'p'
      } else if (age < 6) {
        this.grade = 'k'
      } else if (age < 7) {
        this.grade = '1'
      } else if (age < 8) {
        this.grade = '2'
      } else if (age < 9) {
        this.grade = '3'
      } else if (age < 10) {
        this.grade = '4'
      } else if (age < 11) {
        this.grade = '5'
      } else if (age < 12) {
        this.grade = '6'
      }
    }
  }
}

class ChildRegistrations extends createModule({ namespaced: 'childRegistrations', strict: false }) {
  children = [new ChildRegistration()]

  get isValid () {
    return this.children.every(child => child.isValid || child.isEmpty)
  }

  get isEmpty () {
    return this.children.length === 1 && this.children[0].isEmpty
  }

  @mutation
  addChild () {
    this.children.push(new ChildRegistration())
  }

  @mutation
  updateChild ({ index, props }: {index: number, props: ChildUpdate}) {
    this.children[index].update(props)
  }

  @mutation
  deleteChild ({ index }: { index: number }) {
    this.children.splice(index, 1)
    if (this.children.length === 0) {
      this.children.push(new ChildRegistration())
    }
  }

  @mutation
  clear () {
    this.children.splice(0, this.children.length)
  }
}

export interface ContactUpdate {
  firstName?: string
  lastName?: string
  primaryPhone?: string
  relationship?: string
  childAccess?: boolean
}

export class AdditionalContact {
  firstName = ''
  lastName = ''
  primaryPhone = ''
  relationship = ''
  childAccess: boolean = false

  constructor (state?: ContactUpdate) {
    if (typeof state?.firstName !== 'undefined') {
      this.firstName = state.firstName
    }
    if (typeof state?.lastName !== 'undefined') {
      this.lastName = state.lastName
    }
    if (typeof state?.primaryPhone !== 'undefined') {
      this.primaryPhone = state.primaryPhone
    }
    if (typeof state?.relationship !== 'undefined') {
      this.relationship = state.relationship
    }
    if (typeof state?.childAccess !== 'undefined') {
      this.childAccess = state.childAccess
    }
  }

  get hasChildAccess () {
    return this.childAccess
  }

  set hasChildAccess (value: boolean) { }

  get isEmpty () {
    return this.firstName === '' &&
    this.lastName === '' &&
    this.primaryPhone === '' &&
    this.relationship === '' &&
    !this.childAccess
  }

  get isValid () {
    return this.firstName.length > 0 &&
    this.lastName.length > 0 &&
    this.primaryPhone.length > 0 &&
    this.relationship.length > 0
  }

  update (state: ContactUpdate) {
    if (typeof state?.firstName !== 'undefined') {
      this.firstName = state.firstName
    }
    if (typeof state?.lastName !== 'undefined') {
      this.lastName = state.lastName
    }
    if (typeof state?.primaryPhone !== 'undefined') {
      this.primaryPhone = state.primaryPhone
    }
    if (typeof state?.relationship !== 'undefined') {
      this.relationship = state.relationship
    }
    if (typeof state?.childAccess !== 'undefined') {
      this.childAccess = state.childAccess
    }
  }
}

class AdditionalContacts extends createModule({ namespaced: 'additionalContacts', strict: false }) {
  contacts = [new AdditionalContact()]

  get isValid () {
    return this.contacts.every(contact => contact.isValid || contact.isEmpty)
  }

  get isEmpty () {
    return this.contacts.length === 1 && this.contacts[0].isEmpty
  }

  @mutation
  addContact () {
    this.contacts.push(new AdditionalContact())
  }

  @mutation
  updateContact ({ index, props }: {index: number, props: ContactUpdate}) {
    this.contacts[index].update(props)
  }

  @mutation
  deleteContact ({ index }: { index: number }) {
    this.contacts.splice(index, 1)
    if (this.contacts.length === 0) {
      this.contacts.push(new AdditionalContact())
    }
  }

  @mutation
  clear () {
    this.contacts.splice(0, this.contacts.length)
  }
}

class Volunteer extends createModule({ namespaced: 'volunteer', strict: false }) {
  volunteer: boolean | null = null
  club: clubsType = null

  get volunteerString () {
    return this.volunteer === true ? 'y' : (this.volunteer === false ? 'n' : '')
  }

  set volunteerString (value: string) {
    this.volunteer = value === 'y' ? true : (value === 'n' ? false : null)
  }

  get isValid () {
    return typeof this.volunteer === 'boolean'
  }

  @mutation
  clear () {
    this.volunteer = null
    this.club = null
  }
}

class Terms extends createModule({ namespaced: 'terms', strict: false }) {
  approvedTerms: boolean = false
  photoApproval: boolean | null = null

  get photoApprovalString () {
    return this.photoApproval === true ? 'y' : (this.photoApproval === false ? 'n' : '')
  }

  set photoApprovalString (value: string) {
    this.photoApproval = value === 'y' ? true : (value === 'n' ? false : null)
  }

  get isValid () {
    return this.approvedTerms && typeof this.photoApproval === 'boolean'
  }

  @mutation
  clear () {
    this.approvedTerms = false
    this.photoApproval = null
  }
}
