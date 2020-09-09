import { createModule, mutation } from 'vuex-class-component'

interface ReceivedNotification {
  title: string
  message: string
}

export default class extends createModule({ namespaced: 'system', strict: false }) {
  notification: ReceivedNotification | null = null
  tutorialViewed: boolean = false

  get notificationAvailable () {
    return this.notification !== null
  }

  get hasSeenTutorial () {
    return this.tutorialViewed
  }

  @mutation
  clearNotification () {
    this.notification = null
  }

  @mutation
  addNotification (notification: ReceivedNotification) {
    this.notification = { ...notification }
  }

  @mutation
  setTutorialViewed () {
    this.tutorialViewed = true
  }
}
