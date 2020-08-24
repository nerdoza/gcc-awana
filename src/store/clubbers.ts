import { debounce } from 'ts-debounce'
import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'

import { debounceSaveTimeout, firestoreCollections } from '@/const'
import firebaseProject from '@/plugins/firebase'

const debounceInstances: {[index: string]: ({ cid, clubber }: { cid: string, clubber: Clubber}) => void } = {}
const debouncedSaveClubber = ({ cid, clubber }: {cid: string, clubber: Clubber}) => {
  if (typeof debounceInstances[cid] === 'undefined') {
    debounceInstances[cid] = debounce(({ cid, clubber }: {cid: string, clubber: Clubber}) => {
      void firebaseProject.setDocument(cid, firestoreCollections.clubbers, clubber)
    }, debounceSaveTimeout)
  }
  debounceInstances[cid]({ cid, clubber })
}

export default class extends createModule({ namespaced: 'clubbers', strict: false }) {
  updatedAt: number = 0
  clubbers: {[index: string]: Clubber} = {}

  get clubbersList (): ClubberRecord[] {
    return Object.keys(this.clubbers).map(cid => ({
      cid,
      clubber: this.clubbers[cid]
    }))
  }

  get sinceUpdate () {
    return Date.now() - this.updatedAt
  }

  @action
  async getClubberRecords () {
    const clubbers = await firebaseProject.getCollection(firestoreCollections.clubbers) as {[index: string]: Clubber}
    this._replaceData({ clubbers })
  }

  @action
  async getClubberRecord ({ cid }: {cid: string}) {
    const clubber = await firebaseProject.getDocument(cid, firestoreCollections.clubbers) as Clubber
    this._upsertClubberRecord({ cid, clubber })
  }

  @action
  async createClubberRecord ({ clubber }: {clubber: Clubber}) {
    const cid = await firebaseProject.addDocument(firestoreCollections.clubbers, clubber) as string
    this._upsertClubberRecord({ cid, clubber })
    return cid
  }

  @action
  async updateClubberRecord (payload: {cid: string, clubber: Clubber}) {
    this._upsertClubberRecord(payload)
    debouncedSaveClubber(payload)
  }

  @action
  async deleteClubberRecord ({ cid }: {cid: string}) {
    await firebaseProject.deleteDocument(cid, firestoreCollections.clubbers)
    this._deleteClubberRecord({ cid })
  }

  @mutation
  private _replaceData ({ clubbers }: {clubbers: {[index: string]: Clubber}}) {
    this.clubbers = clubbers
    this.updatedAt = Date.now()
  }

  @mutation
  private _upsertClubberRecord ({ cid, clubber }: ClubberRecord) {
    Vue.set(this.clubbers, cid, clubber)
  }

  @mutation
  private _deleteClubberRecord ({ cid }: {cid: string}) {
    Vue.delete(this.clubbers, cid)
  }
}
