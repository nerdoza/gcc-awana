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
    <v-divider></v-divider>
    <v-subheader>Parents</v-subheader>
    <v-list-item
      v-for="parent in parents"
      :key="parent.phoneNumber"
      @mouseover="parentHover = parent.phoneNumber"
      @mouseleave="parentHover = ''"
    >
      <v-list-item-avatar
        :rounded="false"
        @click="callParent(parent.phoneNumber)"
        :color="parentHover !== parent.phoneNumber ? 'grey lighten-2' : ''"
      >
        <v-icon v-if="parentHover !== parent.phoneNumber">$user</v-icon>
        <v-icon dense color="primary" class="call" v-else>$call</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="parent.firstName + ' ' + parent.lastName"></v-list-item-title>
        <v-list-item-subtitle v-text="parent.phoneNumber"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
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
  parents: User[] = []
  parentHover = ''

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

  callParent (number: string) {
    window.location.href = 'tel:' + number
  }

  async setParents (parentPhoneNumbers: string[]) {
    if (parentPhoneNumbers.length > 0) {
      const parents = await firebaseProject.getCollection(firestoreCollections.users, {
        where: [
          { fieldPath: 'phoneNumber', opStr: 'in', value: parentPhoneNumbers }
        ]
      }) as {[index: string]: User}
      this.parents = Object.keys(parents).map(key => parents[key])
      parentPhoneNumbers.forEach(phoneNumber => {
        if (!this.parents.find(user => user.phoneNumber === phoneNumber)) {
          this.parents.push({ firstName: '', lastName: '', phoneNumber } as User)
        }
      })
    } else {
      this.parents = []
    }
  }

  async mounted () {
    if (typeof this.clubber.clubber.parents !== 'undefined') {
      await this.setParents(this.clubber.clubber.parents)
    }
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
