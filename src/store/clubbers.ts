import { debounce } from 'ts-debounce'
import Vue from 'vue'
import { action, createModule, mutation } from 'vuex-class-component'

import { debounceSaveTimeout, firestoreCollections, getBookTypeByValue } from '@/const'
import firebaseProject, { CollectionFilter } from '@/plugins/firebase'

import { vxm } from '.'

const debounceClubberInstances: {[index: string]: ({ cid, clubber }: { cid: string, clubber: Clubber}) => void } = {}
const debouncedSaveClubber = ({ cid, clubber }: {cid: string, clubber: Clubber}) => {
  if (typeof debounceClubberInstances[cid] === 'undefined') {
    debounceClubberInstances[cid] = debounce(({ cid, clubber }: {cid: string, clubber: Clubber}) => {
      void firebaseProject.setDocument(cid, firestoreCollections.clubbers, clubber)
    }, debounceSaveTimeout)
  }
  debounceClubberInstances[cid]({ cid, clubber })
}

const debounceBookInstances: {[index: string]: ({ cid, book }: { cid: string, book: ClubberBook}) => void } = {}
const debouncedSaveBook = ({ cid, book }: {cid: string, book: ClubberBook}) => {
  if (typeof debounceBookInstances[cid] === 'undefined') {
    debounceBookInstances[cid] = debounce(({ cid, book }: {cid: string, book: ClubberBook}) => {
      void firebaseProject.setDocument(cid, firestoreCollections.clubberBooks, book)
    }, debounceSaveTimeout)
  }
  debounceBookInstances[cid]({ cid, book })
}

const clubberFiltration: () => CollectionFilter = () => {
  if (!vxm.user.needsAllClubbers && !vxm.user.leader) {
    return { where: [{ fieldPath: 'parents', opStr: 'array-contains', value: vxm.user.phoneNumber }] }
  }
  return {}
}

export default class extends createModule({ namespaced: 'clubbers', strict: false }) {
  updatedAt: number = 0
  clubbers: {[index: string]: Clubber} = {}
  books: {[index: string]: ClubberBook} = {}

  get clubbersList (): ClubberRecord[] {
    return Object.keys(this.clubbers).map(cid => ({
      cid,
      clubber: this.clubbers[cid],
      book: this.books[cid]
    }))
  }

  get sinceUpdate () {
    return Date.now() - this.updatedAt
  }

  @action
  async getClubberRecords () {
    let clubbers = await firebaseProject.getCollection(firestoreCollections.clubbers, clubberFiltration()) as {[index: string]: Clubber}
    let books = await firebaseProject.getCollection(firestoreCollections.clubberBooks) as {[index: string]: ClubberBook}
    if (!vxm.user.needsAllClubbers && vxm.user.leader && vxm.user.club !== '') {
      const filteredClubbers: {[index: string]: Clubber} = {}
      const filteredBooks: {[index: string]: ClubberBook} = {}
      for (const cid in clubbers) {
        const clubber = clubbers[cid]
        if (clubber.club === vxm.user.club || (typeof clubber.parents !== 'undefined' && clubber.parents.includes(vxm.user.phoneNumber))) {
          filteredClubbers[cid] = clubber
          filteredBooks[cid] = books[cid]
        }
      }
      clubbers = filteredClubbers
      books = filteredBooks
    }
    this._replaceData({ clubbers, books })
  }

  @action
  async getClubberRecord ({ cid }: {cid: string}) {
    const clubber = await firebaseProject.getDocument(cid, firestoreCollections.clubbers) as Clubber
    const book = await firebaseProject.getDocument(cid, firestoreCollections.clubberBooks) as ClubberBook
    this._upsertClubberRecord({ cid, clubber, book })
  }

  @action
  async createClubberRecord ({ clubber }: {clubber: Clubber}) {
    const cid = await firebaseProject.addDocument(firestoreCollections.clubbers, clubber) as string
    const book: ClubberBook = { type: getBookTypeByValue(clubber.club) }
    await firebaseProject.setDocument(cid, firestoreCollections.clubberBooks, book)
    this._upsertClubberRecord({ cid, clubber, book })
    return cid
  }

  @action
  async updateClubber (payload: {cid: string, clubber: Clubber}) {
    this._updateClubber(payload)
    debouncedSaveClubber(payload)
  }

  @action
  async updateClubberBook (payload: {cid: string, book: ClubberBook}) {
    this._updateClubberBook(payload)
    debouncedSaveBook(payload)
  }

  @action
  async deleteClubberRecord ({ cid }: {cid: string}) {
    await firebaseProject.deleteDocument(cid, firestoreCollections.clubbers)
    await firebaseProject.deleteDocument(cid, firestoreCollections.clubberBooks)
    this._deleteClubberRecord({ cid })
  }

  @action
  async dispose () {
    this._clear()
  }

  @mutation
  private _replaceData ({ clubbers, books }: {clubbers: {[index: string]: Clubber}, books: {[index: string]: ClubberBook}}) {
    this.clubbers = clubbers
    this.books = books
    this.updatedAt = Date.now()
  }

  @mutation
  private _upsertClubberRecord ({ cid, clubber, book }: ClubberRecord) {
    Vue.set(this.clubbers, cid, clubber)
    Vue.set(this.books, cid, book)
  }

  @mutation
  private _updateClubber ({ cid, clubber }: {cid: string, clubber: Clubber}) {
    Vue.set(this.clubbers, cid, clubber)
  }

  @mutation
  private _updateClubberBook ({ cid, book }: {cid: string, book: ClubberBook}) {
    Vue.set(this.books, cid, book)
  }

  @mutation
  private _deleteClubberRecord ({ cid }: {cid: string}) {
    Vue.delete(this.clubbers, cid)
    Vue.delete(this.books, cid)
  }

  @mutation
  private _clear () {
    this.updatedAt = 0
    this.clubbers = {}
    this.books = {}
  }
}
