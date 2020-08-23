import { debounce } from 'ts-debounce'
import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'

import { debounceSaveTimeout, firestoreCollections } from '@/const'
import firebaseProject from '@/plugins/firebase'

const debounceInstances: {[index: string]: ({ uid, role }: { uid: string, role: UserRole}) => void } = {}
const debouncedSaveRole = ({ uid, role }: {uid: string, role: UserRole}) => {
  if (typeof debounceInstances[uid] === 'undefined') {
    debounceInstances[uid] = debounce(({ uid, role }: {uid: string, role: UserRole}) => {
      void firebaseProject.setDocument(uid, firestoreCollections.userRoles, role)
    }, debounceSaveTimeout)
  }
  debounceInstances[uid]({ uid, role })
}

export default class extends createModule({ namespaced: 'appUsers', strict: false }) {
  updatedAt: number = 0
  users: {[index: string]: User} = {}
  roles: {[index: string]: UserRole} = {}

  get usersList (): AppUser[] {
    return Object.keys(this.users).map(uid => ({
      uid,
      user: this.users[uid],
      role: this.roles[uid] ?? {}
    }))
  }

  get sinceUpdate () {
    return Date.now() - this.updatedAt
  }

  @action
  async getAppUsers () {
    const users = await firebaseProject.getCollection(firestoreCollections.users) as {[index: string]: User}
    const roles = await firebaseProject.getCollection(firestoreCollections.userRoles) as {[index: string]: UserRole}
    this._replaceData({ users, roles })
  }

  @action
  async getAppUser ({ uid }: {uid: string}) {
    const user = await firebaseProject.getDocument(uid, firestoreCollections.users) as User
    const role = await firebaseProject.getDocument(uid, firestoreCollections.userRoles) as UserRole
    this._updateAppUser({ uid, user, role })
  }

  @action
  async updateRole (payload: {uid: string, role: UserRole}) {
    this._updateRole(payload)
    debouncedSaveRole(payload)
  }

  @mutation
  private _replaceData ({ users, roles }: {users: {[index: string]: User}, roles: {[index: string]: UserRole} }) {
    this.users = users
    this.roles = roles
    this.updatedAt = Date.now()
  }

  @mutation
  private _updateRole ({ uid, role }: {uid: string, role: UserRole}) {
    Vue.set(this.roles, uid, role)
  }

  @mutation
  private _updateAppUser ({ uid, user, role }: AppUser) {
    Vue.set(this.users, uid, user)
    Vue.set(this.roles, uid, role)
  }
}
