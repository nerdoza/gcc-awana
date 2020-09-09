import Vue from 'vue'
import { createModule, mutation } from 'vuex-class-component'

interface ReceivedNotification {
  title: string
  message: string
}

export default class extends createModule({ namespaced: 'system', strict: false }) {
  notification: ReceivedNotification | null = null
  tutorialViewed: boolean = false
  dataTableState: { [index: string]: { options: DataTableOptions, search: string} } = {}

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

  @mutation
  setDataTableState ({ tableName, state }: { tableName: string, state: { options: DataTableOptions, search: string} }) {
    Vue.set(this.dataTableState, tableName, state)
  }
}
