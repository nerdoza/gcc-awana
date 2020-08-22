import { debounce } from 'ts-debounce'
import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'

import { debonceSaveTimeout, firestoreCollections } from '@/const'
import firebaseProject from '@/plugins/firebase'

export default class extends createModule({ namespaced: 'appUsers', strict: false }) {
  updatedAt: number = Date.now()
  users: {[index: string]: User} = {}
  roles: {[index: string]: UserRole} = {}

  private readonly debouncedSaveRole = debounce(({ uid, role }: {uid: string, role: UserRole}) => {
    void firebaseProject.setDocument(uid, firestoreCollections.userRoles, role)
  }, debonceSaveTimeout)

  get usersList () {
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
    this.replaceData({ users, roles })
  }

  @action
  async getAppUser ({ uid }: {uid: string}) {
    const user = await firebaseProject.getDocument(uid, firestoreCollections.users) as User
    const role = await firebaseProject.getDocument(uid, firestoreCollections.userRoles) as UserRole
    this.upsertAppUser({ uid, user, role })
  }

  @action
  async updateRole (payload: {uid: string, role: UserRole}) {
    this.upsertRole(payload)
    this.debouncedSaveRole(payload)
  }

  @mutation
  replaceData ({ users, roles }: {users: {[index: string]: User}, roles: {[index: string]: UserRole} }) {
    this.users = users
    this.roles = roles
    this.updatedAt = Date.now()
  }

  @mutation
  upsertRole ({ uid, role }: {uid: string, role: UserRole}) {
    this.roles[uid] = role
  }

  @mutation
  upsertAppUser ({ uid, user, role }: AppUser) {
    this.users[uid] = user
    this.roles[uid] = role
  }

  @mutation
  removeAppUser ({ uid }: {uid: string}) {
    Vue.delete(this.users, uid)
    Vue.delete(this.roles, uid)
  }
}
