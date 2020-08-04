import { createModule, mutation } from 'vuex-class-component'

interface Notification {
  title: string
  message: string
}

export default class extends createModule({ namespaced: 'notification', strict: false }) {
  title =''
  message = ''

  get isEmpty () {
    return this.title === '' && this.message === ''
  }

  @mutation
  clear () {
    this.title = ''
    this.message = ''
  }

  @mutation
  push (notification: Notification) {
    this.title = notification.title
    this.message = notification.message
  }
}
