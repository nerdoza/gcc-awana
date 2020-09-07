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
        :disabled="state !== 'none' || file === null"
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
import { format } from 'date-fns'
import { Component, Emit, Vue } from 'vue-property-decorator'

import { firestoreCollections, formatPhoneNumber, getAgeAsOfSchoolStart, getGradeByAge } from '@/const'
import { parseCSV } from '@/lib/csv'
import firebaseProject from '@/plugins/firebase'
import { vxm } from '@/store'

const isNotValidClubber = (data: ShelbyExportedFlatClubber) => {
  return typeof data !== 'object' ||
  typeof data.childFirstName !== 'string' ||
  data.childFirstName === '' ||
  typeof data.childLastName !== 'string' ||
  data.childLastName === '' ||
  typeof data.childBirthDate !== 'string' ||
  data.childBirthDate === ''
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

  async importFile () {
    if (this.file !== null) {
      this.state = 'loading'
      const importData = await parseCSV(this.file) as ShelbyExportedFlatClubber[]
      this.totalToImport = importData.length

      for (let i = 0; i < importData.length; i++) {
        const data = importData[i]
        if (isNotValidClubber(data)) {
          this.skipped++
          continue
        }
        const existing = await firebaseProject.getCollection(firestoreCollections.clubbers, {
          where: [
            { fieldPath: 'firstName', opStr: '==', value: data.childFirstName },
            { fieldPath: 'lastName', opStr: '==', value: data.childLastName },
            { fieldPath: 'birthday', opStr: '==', value: format(new Date(data.childBirthDate), 'MM/dd/yyyy') }
          ]
        }) as {[index: string]:Clubber}
        if (Object.keys(existing).length > 0) {
          this.skipped++
        } else {
          const parents: string[] = []
          if (typeof data.phoneNumber !== 'undefined' && data.phoneNumber !== '' && data.phoneNumber !== null) {
            const formattedPhoneNumber = formatPhoneNumber(data.phoneNumber)
            if (typeof formattedPhoneNumber !== 'undefined') {
              parents.push(formattedPhoneNumber)
            }
          }

          let club: Club = 's' as Club.Sparks
          switch (data.childClub) {
            case 'AK20CU-Cubbie':
              club = 'c' as Club.Cubbies
              break
            case 'AK20SP-SPARKS':
              club = 's' as Club.Sparks
              break
            case 'AK20GL-T&T GIRLS':
              club = 'g' as Club.GirlsTNT
              break
            case 'AK20BY-T&T BOYS':
              club = 'b' as Club.BoysTNT
              break
          }

          await vxm.clubbers.createClubberRecord({
            clubber: {
              firstName: data.childFirstName,
              lastName: data.childLastName,
              birthday: format(new Date(data.childBirthDate), 'MM/dd/yyyy'),
              gender: (data.childGender === 'Male' ? 'm' : 'f') as Gender,
              club: club as Club,
              grade: getGradeByAge(getAgeAsOfSchoolStart(data.childBirthDate)) as Grade,
              parents
            }
          })

          this.imported++
        }
      }

      this.state = 'finished'
    }
  }
}
</script>
