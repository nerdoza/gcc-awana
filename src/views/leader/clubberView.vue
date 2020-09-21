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
            <clubber-parent-details :record="record"></clubber-parent-details>
            <template v-if="book.type === 'c'">
              <cubbies-book-full-details :record="record"></cubbies-book-full-details>
            </template>
            <template v-if="book.type === 's'">
              <sparks-book-full-details :record="record"></sparks-book-full-details>
            </template>
            <template v-if="book.type === 't'">
              <t-n-t-book-full-details :record="record"></t-n-t-book-full-details>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import ClubberParentDetails from '@/components/partials/clubberParentDetails.vue'
import CubbiesBookFullDetails from '@/components/partials/cubbiesBookFullDetails.vue'
import SparksBookFullDetails from '@/components/partials/sparksBookFullDetails.vue'
import TNTBookFullDetails from '@/components/partials/tntBookFullDetails.vue'
import { getFullname } from '@/const'
import { vxm } from '@/store'

@Component({
  components: {
    CubbiesBookFullDetails,
    SparksBookFullDetails,
    TNTBookFullDetails,
    ClubberParentDetails
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
