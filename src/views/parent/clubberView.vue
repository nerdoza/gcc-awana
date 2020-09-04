<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card>
          <v-toolbar flat dark color="primary">
            <v-toolbar-title v-text="fullName"></v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$left</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <template v-if="book.type === 't'">
              <p>T&amp;T</p>
            </template>
            <template v-if="book.type === 's'">
              <sparks-parent-details :record="record"></sparks-parent-details>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import SparksParentDetails from '@/components/partials/sparksParentDetails.vue'
import { getFullname } from '@/const'
import { vxm } from '@/store'

@Component({
  components: {
    SparksParentDetails
  }
})
export default class extends Vue {
  @Prop() readonly cid!: string

  loading = false

  get clubber () {
    return vxm.clubbers.clubbers[this.cid]
  }

  get book () {
    return vxm.clubbers.books[this.cid]
  }

  get record () {
    return { cid: this.cid, clubber: this.clubber, book: this.book }
  }

  get fullName () {
    return getFullname(this.clubber)
  }

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
