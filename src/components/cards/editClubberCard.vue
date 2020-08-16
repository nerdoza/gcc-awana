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
        <v-col cols="12" sm="6" class="pb-0">
          <div class="display-1">{{ clubber.clubber.fullName }}</div>
          <div class="headline">{{ clubber.clubber.club }}</div>
        </v-col>
        <v-col cols="12" sm="6" class="pb-0">
          <div>{{ clubber.clubber.grade }}</div>
          <div>{{ clubber.clubber.birthday }}</div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { debounce } from 'ts-debounce'
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'

import { ClubSelect } from '@/const'
import firebaseProject from '@/plugins/firebase'

@Component
export default class extends Vue {
  @Prop() readonly clubber!: {uid: string, clubber: Clubber}
  readonly clubSelect = ClubSelect

  readonly debouncedSave = debounce((user) => {
    void firebaseProject.setDocument(this.clubber.uid, 'clubber', user.user.role)
  }, 1500)

  @Watch('clubber', { deep: true })
  onClubberChanged (clubber: {uid: string, clubber: Clubber}) {
    this.debouncedSave(clubber)
  }

  @Emit()
  close () {
    return undefined
  }
}
</script>
