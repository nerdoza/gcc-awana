import { action, createModule, mutation } from 'vuex-class-component'

export default class extends createModule({ namespaced: 'user', strict: false }) {
  hasLaunched = false

  @action
  async setHasLaunched () {
    this._setHasLaunched()
  }

  @mutation
  private _setHasLaunched () {
    this.hasLaunched = true
  }
}
