/* eslint-disable simple-import-sort/sort */
import { isCordova, isDevelopment } from '@/const'

import * as firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

import { vxm } from '@/store'

export interface CollectionFilter {
  where?: Array<{
    fieldPath: string
    opStr: firebase.firestore.WhereFilterOp
    value: any
  }>
  orderBy?: Array<{
    fieldPath: string
    directionStr?: firebase.firestore.OrderByDirection
  }>
  limit?: Array<{
    limit: number
  }>
}

class FirebaseX {
  private readonly firebaseJS: firebase.app.App
  private readonly jsDB: firebase.firestore.Firestore

  constructor () {
    if (!isCordova) {
      const firebaseConfig = {
        apiKey: 'AIzaSyCT7Ldrdw-oXekcHymxV6qU0pWvVIHp7Eo',
        authDomain: 'gcc-awana.firebaseapp.com',
        databaseURL: 'https://gcc-awana.firebaseio.com',
        projectId: 'gcc-awana',
        storageBucket: 'gcc-awana.appspot.com',
        messagingSenderId: '994083046541',
        appId: '1:994083046541:web:d08c5a91f182e163624ec4',
        measurementId: 'G-0RHL0D8M8D'
      }
      this.firebaseJS = firebase.initializeApp(firebaseConfig)
      this.jsDB = firebase.firestore()
      if (isDevelopment) {
        this.jsDB.settings({
          host: 'localhost:8080',
          ssl: false
        })
      }
      firebase.analytics()
      firebase.auth().useDeviceLanguage()
      void this.attemptSignIn()
    } else {
      this.firebaseJS = {} as unknown as firebase.app.App
      this.jsDB = {} as unknown as firebase.firestore.Firestore

      document.addEventListener('deviceready', () => {
        void this.attemptSignIn()
        void this.setupNotifications()
      }, false)
    }
  }

  get firebaseCordova () {
    return window.FirebasePlugin
  }

  async signOut () {
    if (!isCordova) {
      await this.firebaseJS?.auth().signOut()
    } else {
      try {
        await new Promise((resolve, reject) => {
          this.firebaseCordova.signOutUser(() => resolve(), (error: string) => reject(new Error(error)))
        })
      } catch (error) { }
    }
  }

  async attemptSignIn () {
    if (!isCordova) {
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user !== null) {
          const user = await this.getCurrentUser()
          await vxm.user.userSignedIn(user)
        } else {
          await vxm.user.userSignedOut()
        }
      })
    } else {
      await new Promise((resolve, reject) => {
        this.firebaseCordova.isUserSignedIn(async (isSignedIn: boolean) => {
          if (isSignedIn) {
            const user = await this.getCurrentUser()
            await vxm.user.userSignedIn(user)
          } else {
            await vxm.user.userSignedOut()
          }
          resolve()
        }, (error: string) => reject(new Error(error)))
      })
    }
  }

  async getCurrentUser (): Promise<AuthUser> {
    if (!isCordova) {
      return await new Promise((resolve, reject) => {
        const user = this.firebaseJS.auth().currentUser
        if (user === null) {
          reject(new Error('unknown user'))
        } else {
          resolve({
            name: user.displayName ?? '',
            email: user.email ?? '',
            phoneNumber: user.phoneNumber ?? '',
            uid: user.uid
          })
        }
      })
    } else {
      return await new Promise((resolve, reject) => {
        this.firebaseCordova.getCurrentUser((user: any) => resolve({
          name: user.name ?? '',
          email: user.email ?? '',
          phoneNumber: user.phoneNumber ?? '',
          uid: user.uid
        }), (error: string) => reject(new Error(error)))
      })
    }
  }

  setupNotifications () {
    if (isCordova) {
      this.firebaseCordova.grantPermission(() => {})

      this.firebaseCordova.onMessageReceived((message: {title: string, body: string}) => {
        vxm.notification.push({ title: message.title, message: message.body })
      })
    }
  }

  private readonly recaptchaVerifiers = new Map<string, firebase.auth.RecaptchaVerifier>()

  clearVerifier (elementId: string) {
    const verifier = this.recaptchaVerifiers.get(elementId)
    if (typeof verifier !== 'undefined') {
      verifier.clear()
      this.recaptchaVerifiers.delete(elementId)
    }
  }

  async verifyPhoneNumber (phoneNumber: string, elementId: string, options: {timeout: number, fakeVerificationCode?: string} = { timeout: 120 }) {
    if (!isCordova) {
      let verifier
      if (this.recaptchaVerifiers.has(elementId)) {
        verifier = this.recaptchaVerifiers.get(elementId)
      } else {
        verifier = new firebase.auth.RecaptchaVerifier(elementId, { size: 'invisible' })
        this.recaptchaVerifiers.set(elementId, verifier)
      }
      if (typeof verifier !== 'undefined') {
        const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, verifier)
        return async (code: string) => {
          await confirmationResult.confirm(code)
        }
      }
    } else {
      const resolve: (code: string) => Promise<void> = await new Promise((resolve, reject) => {
        this.firebaseCordova.verifyPhoneNumber((credential: {instantVerification: boolean, id: string, verificationId: string, code?: string}) => {
          if (credential.instantVerification) {
            this.firebaseCordova.signInWithCredential(credential, async () => {
              const user = await this.getCurrentUser()
              await vxm.user.userSignedIn(user)
              resolve(async (code: string) => { })
            }, (error: string) => reject(new Error(error)))
          } else {
            resolve(async (code: string) => {
              await new Promise((resolve, reject) => {
                credential.code = code
                this.firebaseCordova.signInWithCredential(credential, () => resolve(), (error: string) => reject(new Error(error)))
              })
            })
          }
        }, (error: string) => reject(new Error(error)), phoneNumber, options.timeout, options?.fakeVerificationCode)
      })
      return resolve
    }
  }

  async getDocument (documentId: string, collection: string) {
    if (!isCordova) {
      return (await this.jsDB.collection(collection).doc(documentId).get())?.data()
    } else {
      return await new Promise((resolve, reject) => {
        this.firebaseCordova.fetchDocumentInFirestoreCollection(documentId, collection, (document: any) => resolve(document), (error: string) => {
          if (error === 'No document found in collection') {
            resolve()
          } else {
            reject(new Error(error))
          }
        })
      })
    }
  }

  async addDocument (collection: string, document: object) {
    if (!isCordova) {
      return (await this.jsDB.collection(collection).add(document))?.id
    } else {
      return await new Promise((resolve, reject) => {
        this.firebaseCordova.addDocumentInFirestoreCollection(document, collection, (id: string) => resolve(id), (error: string) => reject(new Error(error)))
      })
    }
  }

  async setDocument (documentId: string, collection: string, document: object) {
    if (!isCordova) {
      return await this.jsDB.collection(collection).doc(documentId).set(document)
    } else {
      return await new Promise((resolve, reject) => {
        this.firebaseCordova.setDocumentInFirestoreCollection(documentId, document, collection, () => resolve(), (error: string) => reject(new Error(error)))
      })
    }
  }

  async updateDocument (documentId: string, collection: string, document: object) {
    if (!isCordova) {
      return await this.jsDB.collection(collection).doc(documentId).update(document)
    } else {
      return await new Promise((resolve, reject) => {
        this.firebaseCordova.updateDocumentInFirestoreCollection(documentId, document, collection, () => resolve(), (error: string) => reject(new Error(error)))
      })
    }
  }

  async deleteDocument (documentId: string, collection: string) {
    if (!isCordova) {
      return await this.jsDB.collection(collection).doc(documentId).delete()
    } else {
      return await new Promise((resolve, reject) => {
        this.firebaseCordova.deleteDocumentFromFirestoreCollection(documentId, collection, () => resolve(), (error: string) => reject(new Error(error)))
      })
    }
  }

  async getCollection (collection: string, filters?: CollectionFilter) {
    if (!isCordova) {
      const ref = this.jsDB.collection(collection)
      if (typeof filters !== 'undefined') {
        if (typeof filters.where !== 'undefined') {
          filters.where.forEach(filter => {
            ref.where(filter.fieldPath, filter.opStr, filter.value)
          })
        }
        if (typeof filters.orderBy !== 'undefined') {
          filters.orderBy.forEach(filter => {
            ref.orderBy(filter.fieldPath, filter.directionStr)
          })
        }
        if (typeof filters.limit !== 'undefined') {
          filters.limit.forEach(filter => {
            ref.limit(filter.limit)
          })
        }
      }
      const docQuery = await ref.get()
      const result: {[id: string]: any} = {}
      docQuery.forEach(d => { result[d.id] = d.data() })
      return result
    } else {
      return await new Promise((resolve, reject) => {
        const cordovaFilter: any[][] = []
        if (typeof filters !== 'undefined') {
          if (typeof filters.where !== 'undefined') {
            filters.where.forEach(filter => {
              cordovaFilter.push(['where', filter.fieldPath, filter.opStr, filter.value])
            })
          }
          if (typeof filters.orderBy !== 'undefined') {
            filters.orderBy.forEach(filter => {
              cordovaFilter.push(['orderBy', filter.fieldPath, filter.directionStr])
            })
          }
          if (typeof filters.limit !== 'undefined') {
            filters.limit.forEach(filter => {
              cordovaFilter.push(['limit', filter.limit])
            })
          }
        }
        this.firebaseCordova.fetchFirestoreCollection(collection, cordovaFilter, (documents: any) => resolve(documents), (error: string) => {
          if (error === 'No document found in collection') {
            resolve()
          } else {
            reject(new Error(error))
          }
        })
      })
    }
  }

  async updateUserName (name: string) {
    if (!isCordova) {
      const user = this.firebaseJS.auth().currentUser
      await user?.updateProfile({ displayName: name })
    } else {
      await new Promise((resolve, reject) => {
        this.firebaseCordova.updateUserProfile({ name }, () => resolve(), (error: string) => reject(new Error(error)))
      })
    }
  }

  async updateUserEmail (email: string) {
    if (!isCordova) {
      const user = this.firebaseJS.auth().currentUser
      await user?.updateEmail(email)
    } else {
      await new Promise((resolve, reject) => {
        this.firebaseCordova.updateUserEmail(email, () => resolve(), (error: string) => reject(new Error(error)))
      })
    }
  }
}

const firebaseProject = new FirebaseX()

export default firebaseProject
