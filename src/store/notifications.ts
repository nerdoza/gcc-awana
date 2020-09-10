import { debounce } from 'ts-debounce'
import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'

import { debounceSaveTimeout, firestoreCollections } from '@/const'
import { sendNotification } from '@/lib/notification'
import firebaseProject, { CollectionFilter } from '@/plugins/firebase'

const debounceInstances: {[index: string]: ({ nid, notification }: AppNotificationRecord) => void } = {}
const debouncedUpdateNotification = ({ nid, notification }: AppNotificationRecord) => {
  if (typeof debounceInstances[nid] === 'undefined') {
    debounceInstances[nid] = debounce(({ nid, notification }: AppNotificationRecord) => {
      void firebaseProject.updateDocument(nid, firestoreCollections.notifications, notification)
    }, debounceSaveTimeout)
  }
  debounceInstances[nid]({ nid, notification })
}

export default class extends createModule({ namespaced: 'notifications', strict: false }) {
  updatedAt: number = 0
  notifications: {[index: string]: AppNotification} = {}

  get notificationsList (): AppNotificationRecord[] {
    return Object.keys(this.notifications).map(nid => ({
      nid,
      notification: this.notifications[nid]
    }))
  }

  get sinceUpdate () {
    return Date.now() - this.updatedAt
  }

  @action
  async getNotifications () {
    const filter: CollectionFilter = {
      orderBy: [{ fieldPath: 'sentAt', directionStr: 'desc' }]
    }
    const notifications = await firebaseProject.getCollection(firestoreCollections.notifications, filter) as {[index: string]: AppNotification}
    this._replaceData({ notifications })
  }

  @action
  async getNotification ({ nid }: {nid: string}) {
    const notification = await firebaseProject.getDocument(nid, firestoreCollections.notifications) as AppNotification
    this._upsertNotification({ nid, notification })
  }

  @action
  async createNotification ({ title, text }: {title: string, text: string}) {
    const notification: AppNotification = { title, text, createdAt: Date.now() }
    const nid = await firebaseProject.addDocument(firestoreCollections.notifications, notification) as string
    this._upsertNotification({ nid, notification })
    return nid
  }

  @action
  async updateNotification ({ nid, notification }: AppNotificationRecord) {
    if (typeof this.notifications[nid].sentAt !== 'undefined') {
      throw new Error('Notification already sent')
    }
    const notificationDelta = { ...this.notifications[nid], title: notification.title, text: notification.text }
    await debouncedUpdateNotification({ nid, notification: notificationDelta })
    this._upsertNotification({ nid, notification: notificationDelta })
  }

  @action
  async deleteNotification ({ nid }: {nid: string}) {
    await firebaseProject.deleteDocument(nid, firestoreCollections.notifications)
    this._deleteNotification({ nid })
  }

  @action
  async sendNotification ({ nid }: {nid: string}) {
    const notification = { ...this.notifications[nid] }
    const config = await firebaseProject.getDocument('notification', firestoreCollections.configs) as {key: string}
    await sendNotification(notification, config.key)
    notification.sentAt = Date.now()
    this._upsertNotification({ nid, notification })
    await firebaseProject.updateDocument(nid, firestoreCollections.notifications, { sentAt: notification.sentAt })
  }

  @action
  async dispose () {
    this._clear()
  }

  @mutation
  private _replaceData ({ notifications }: {notifications: {[index: string]: AppNotification} }) {
    this.notifications = notifications
    this.updatedAt = Date.now()
  }

  @mutation
  private _upsertNotification ({ nid, notification }: AppNotificationRecord) {
    Vue.set(this.notifications, nid, notification)
  }

  @mutation
  private _deleteNotification ({ nid }: {nid: string}) {
    Vue.delete(this.notifications, nid)
  }

  @mutation
  private _clear () {
    this.updatedAt = 0
    this.notifications = {}
  }
}
