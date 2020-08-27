<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" v-for="(record, index) in updates" :key="index">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <update-card :update="record.update"></update-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import UpdateCard from '@/components/cards/updateCard.vue'
import { oneHour, oneMonth } from '@/const'
import { vxm } from '@/store'

@Component({
  components: {
    UpdateCard
  }
})
export default class extends Vue {
    loading = false

    get updates () {
      const now = Date.now()
      return vxm.updates.updatesList
        .filter(records => records.update.postAt < now && records.update.postAt > now - (oneMonth * 3))
        .sort((a, b) => a.update.postAt > b.update.postAt ? -1 : 1)
    }

    async mounted () {
      if (vxm.updates.sinceUpdate > oneHour) {
        await this.refreshData()
      }
    }

    async refreshData () {
      this.loading = true
      await vxm.updates.getUpdates()
      this.loading = false
    }
}
</script>
