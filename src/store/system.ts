import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'

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

  @action
  async clearNotification () {
    this._clearNotification()
  }

  @action
  async addNotification (notification: ReceivedNotification) {
    this._addNotification(notification)
  }

  @action
  async setTutorialViewed () {
    this._setTutorialViewed()
  }

  @action
  async setDataTableState (params: { tableName: string, state: { options: DataTableOptions, search: string} }) {
    this._setDataTableState(params)
  }

  @action
  async dispose () {
    this._clear()
  }

  @mutation
  private _clearNotification () {
    this.notification = null
  }

  @mutation
  private _addNotification (notification: ReceivedNotification) {
    this.notification = { ...notification }
  }

  @mutation
  private _setTutorialViewed () {
    this.tutorialViewed = true
  }

  @mutation
  private _setDataTableState ({ tableName, state }: { tableName: string, state: { options: DataTableOptions, search: string} }) {
    Vue.set(this.dataTableState, tableName, state)
  }

  @mutation
  private _clear () {
    this.notification = null
    this.tutorialViewed = false
    this.dataTableState = {}
  }
}
