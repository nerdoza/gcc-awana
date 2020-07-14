import { createModule, createSubModule } from 'vuex-class-component'

import { phoneNumberRegex, zipCodeRegex } from '@/const'

export default class extends createModule({ namespaced: 'registration', strict: false }) {
  adultRegistration = createSubModule(AdultRegistration)
}

class AdultRegistration extends createModule({ namespaced: 'adultRegistration', strict: false }) {
  firstName = ''
  lastName = ''
  streetAddress = ''
  city = ''
  state = ''
  zip = ''
  email = ''
  primaryPhone = '+1 (559) 801-8823'
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
}
