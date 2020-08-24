import { createModule, mutation } from 'vuex-class-component'

interface ReceivedNotification {
  title: string
  message: string
}

export default class extends createModule({ namespaced: 'system', strict: false }) {
  notification: ReceivedNotification | null = null

  get notificationAvailable () {
    return this.notification !== null
  }

  @mutation
  clearNotification () {
    this.notification = null
  }

  @mutation
  addNotification (notification: ReceivedNotification) {
    this.notification = { ...notification }
  }
}
