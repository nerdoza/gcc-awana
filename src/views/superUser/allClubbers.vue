<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-card-title>
            Clubbers
            <v-btn icon class="ml-2" @click="download">
              <v-icon>$download</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="download" class="mr-4">
              <v-icon>$import</v-icon>
            </v-btn>
            <v-btn @click="createClubber" class="primary">
              <v-icon class="mr-2">$addUser</v-icon>New Clubber
            </v-btn>
          </v-card-title>
          <v-card-actions>
            <v-text-field v-model="search" append-icon="$search" label="Search"></v-text-field>
          </v-card-actions>
          <v-data-table
            :headers="headers"
            :items="clubbersList"
            :search="search"
            :items-per-page="15"
            @click:row="editClubber"
            :loading="loading"
            loading-text="Loading Clubbers..."
            class="clickable"
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="clubberEditDialog" max-width="700px" transition="dialog-bottom-transition">
      <edit-clubber
        v-if="clubberEditDialog"
        :clubber="focusClubber"
        v-on:update="updateClubber"
        v-on:close="clubberEditDialog = false"
      ></edit-clubber>
    </v-dialog>
    <v-dialog v-model="clubberCreateDialog" max-width="700px" transition="dialog-bottom-transition">
      <create-clubber
        v-if="clubberCreateDialog"
        v-on:close="clubberCreateDialog = false"
        v-on:create="pushNewClubber"
      ></create-clubber>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import CreateClubber from '@/components/cards/createClubberCard.vue'
import EditClubber from '@/components/cards/editClubberCard.vue'
import { firestoreCollections, getClubByValue, getFullname, getGradeByValue } from '@/const'
import { createCSV } from '@/lib/csv'
import firebaseProject from '@/plugins/firebase'

@Component({
  components: {
    EditClubber,
    CreateClubber
  }
})
export default class extends Vue {
  clubbers: {[index: string]: Clubber} = {}
  loading = false
  search = ''
  clubberEditDialog = false
  clubberCreateDialog = false
  focusClubber : null | {uid: string, clubber: Clubber} = null

  readonly headers = [
    { text: 'Name', value: 'clubber.fullName' },
    { text: 'Grade', value: 'clubber.gradeName', groupable: true },
    { text: 'Club', value: 'clubber.clubName', groupable: true }
  ]

  get clubbersList () {
    return Object.keys(this.clubbers).map(uid => ({
      uid,
      clubber: {
        ...this.clubbers[uid],
        clubName: getClubByValue(this.clubbers[uid].club),
        gradeName: getGradeByValue(this.clubbers[uid].grade),
        fullName: getFullname(this.clubbers[uid])
      }
    }))
  }

  async mounted () {
    await this.refreshData()
  }

  async refreshData () {
    this.loading = true
    this.clubbers = await firebaseProject.getCollection(firestoreCollections.clubbers) as {[index: string]: Clubber}

    this.loading = false
  }

  editClubber (clubber: {uid: string, clubber: Clubber}) {
    this.focusClubber = clubber
    this.clubberEditDialog = true
  }

  updateClubber ({ uid, clubber }: {uid: string, clubber: Clubber}) {
    // console.log(clubber)
    this.$set(this.clubbers, uid, clubber)
  }

  createClubber () {
    this.clubberCreateDialog = true
  }

  pushNewClubber ({ uid, clubber }: {uid: string, clubber: Clubber}) {
    this.$set(this.clubbers, uid, clubber)
    this.clubberCreateDialog = false
  }

  download () {
    const data = Object.keys(this.clubbers).map(uid => ({
      'First Name': this.clubbers[uid].firstName,
      'Last Name': this.clubbers[uid].lastName,
      Club: this.clubbers[uid].club,
      Birthday: this.clubbers[uid].birthday,
      Gender: this.clubbers[uid].gender,
      Grade: this.clubbers[uid].grade
    }))

    createCSV(data, 'clubbers.csv')
  }
}
</script>
