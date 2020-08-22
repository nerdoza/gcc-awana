<template>
  <v-card tile class="edit-clubber-card">
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Clubber</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <div class="headline">{{ fullName }}</div>
          <div>{{ clubber.clubber.birthday }}</div>
          <div>Grade: {{ grade }}</div>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select label="Leader" v-model="clubber.clubber.leader" :items="leaderSelect"></v-select>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

import { firestoreCollections, getGradeByValue } from '@/const'
import firebaseProject from '@/plugins/firebase'

@Component
export default class extends Vue {
  @Prop() readonly clubber!: {uid: string, clubber: Clubber}
  @Prop() readonly leaders!: {[index: string]: User}

  get leaderSelect () {
    return Object.keys(this.leaders).map(key => ({
      value: key,
      text: this.leaders[key].firstName + ' ' + this.leaders[key].lastName
    }))
  }

  get fullName () {
    return this.clubber.clubber.firstName + ' ' + this.clubber.clubber.lastName
  }

  get grade () {
    return getGradeByValue(this.clubber.clubber.grade)
  }

  @Watch('clubber', { deep: true })
  async onClubberChanged ({ uid, clubber }: {uid: string, clubber: Clubber}) {
    await firebaseProject.updateDocument(uid, firestoreCollections.clubbers, { leader: clubber.leader })
    this.update({ uid, clubber })
  }

  @Emit()
  update (clubber: {uid: string, clubber: Clubber}) {
    return clubber
  }

  @Emit()
  close () {
    return undefined
  }
}
</script>
