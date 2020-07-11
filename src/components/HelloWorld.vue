<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img :src="require('../assets/logo.svg')" class="my-3" contain height="200" />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3" v-on:click="clearName()">Hello {{ user.fullname }}!</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { vxm } from '@/store'

@Component({
  data () {
    return {
      user: vxm.user
    }
  }
})
export default class extends Vue {
  clearName = () => vxm.user.clearName()
}
</script>
