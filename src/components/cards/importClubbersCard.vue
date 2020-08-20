<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Import Clubbers</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pb-0">
      <v-file-input
        label="Import File (.csv)"
        accept=".csv"
        v-model="file"
        :disabled="state !== 'none'"
      ></v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-chip color="secondary" v-if="state === 'loading'">
        {{ imported }} imported of {{ totalToImport }}
        <template
          v-if="skipped > 0"
        >({{ skipped }} skipped)</template>
      </v-chip>
      <v-chip color="primary ml-2" v-if="state === 'finished'">{{ completedText }}</v-chip>
      <v-spacer></v-spacer>
      <v-btn
        @click="importFile"
        class="primary mr-2 mb-2"
        v-if="state !== 'finished'"
        :disabled="state !== 'none' && file !== null"
      >
        <v-icon class="mr-2 fa-spin" v-if="state !== 'none'">$spinner</v-icon>
        <v-icon class="mr-2" v-if="state === 'none'">$import</v-icon>Import
      </v-btn>
      <v-btn @click="close" class="primary mr-2 mb-2" v-if="state === 'finished'">
        <v-icon class="mr-2">$check</v-icon>Done
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'

import { firestoreCollections } from '@/const'
import { parseCSV } from '@/lib/csv'
import firebaseProject from '@/plugins/firebase'

const isNotValidClubber = (data: Clubber | {[index: string]: string}) => {
  return typeof data !== 'object' ||
  typeof data.firstName !== 'string' ||
  data.firstName === '' ||
  typeof data.lastName !== 'string' ||
  data.lastName === '' ||
  typeof data.birthday !== 'string' ||
  data.birthday === '' ||
  typeof data.gender !== 'string' ||
  data.gender === '' ||
  typeof data.grade !== 'string' ||
  data.grade === '' ||
  typeof data.club !== 'string' ||
  data.club === ''
}

@Component
export default class extends Vue {
  file: File | null = null
  state : 'none' | 'loading' | 'finished' | 'error' = 'none'
  imported = 0
  skipped = 0
  totalToImport = 0

  get completedText () {
    let output = 'Imported ' + this.imported.toString()
    if (this.skipped > 0) {
      output += ', Skipped ' + this.skipped.toString()
    }
    return output
  }

  @Emit()
  close () {
    return undefined
  }

  @Emit()
  import () {
    return undefined
  }

  async importFile () {
    if (this.file !== null) {
      this.state = 'loading'
      const importData = await parseCSV(this.file) as Clubber[]
      this.totalToImport = importData.length
      for (let i = 0; i < importData.length; i++) {
        const data = importData[i]
        if (isNotValidClubber(data)) {
          this.skipped++
          continue
        }
        const existing = await firebaseProject.getCollection(firestoreCollections.clubbers, {
          where: [
            { fieldPath: 'firstName', opStr: '==', value: data.firstName },
            { fieldPath: 'lastName', opStr: '==', value: data.lastName },
            { fieldPath: 'birthday', opStr: '==', value: data.birthday }
          ]
        }) as {[index: string]:Clubber}
        if (Object.keys(existing).length > 0) {
          this.skipped++
        } else {
          await firebaseProject.addDocument(firestoreCollections.clubbers, {
            firstName: data.firstName,
            lastName: data.lastName,
            birthday: data.birthday,
            gender: data.gender,
            club: data.club,
            grade: data.grade.toString()
          })
          this.imported++
        }
      }
      this.state = 'finished'
      this.import()
    }
  }
}
</script>
