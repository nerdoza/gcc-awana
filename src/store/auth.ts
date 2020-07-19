import { action, createModule } from 'vuex-class-component'

import { phoneNumberRegex } from '@/const'
import firebaseProject from '@/plugins/firebase'

export default class extends createModule({ namespaced: 'auth', strict: false }) {
  phoneNumber: string | null = null

  get isValidPhoneNumber () {
    return this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)
  }

  @action
  async requestVerification (elementId: string) {
    if (this.phoneNumber !== null && phoneNumberRegex.test(this.phoneNumber)) {
      await firebaseProject.verifyPhoneNumber(this.phoneNumber, elementId)
    }
  }
}
