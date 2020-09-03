<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card tile>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title v-text="getFullname(clubber)"></v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$left</v-icon>
            </v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { getFullname } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly cid!: string

  loading = false
  clubber = { ...vxm.clubbers.clubbers[this.cid] }

  readonly getFullname = getFullname

  async refreshData () {
    this.loading = true
    await vxm.clubbers.getClubberRecord({ cid: this.cid })
    this.loading = false
  }

  close () {
    this.$router.go(-1)
  }
}
</script>
