<template>
  <v-card tile>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Add Clubber Parent</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pb-0 pt-2">
      <v-form @submit.prevent="add">
        <v-text-field
          label="Phone Number"
          name="phone"
          prepend-icon="$phone"
          type="tel"
          v-facade="phoneNumberMask"
          v-model.trim="phoneNumber"
          :error-messages="erroMessage"
          autofocus
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="add" class="primary mr-2 mb-2" :disabled="!isValid">Add</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { facade } from 'vue-input-facade'
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

import { phoneNumberMask, phoneNumberRegex } from '@/const'
import { vxm } from '@/store'

@Component({
  directives: {
    facade
  }
})
export default class extends Vue {
  @Prop() readonly cid!: string

  readonly phoneNumberMask = phoneNumberMask

  phoneNumber = ''
  erroMessage = ''

  get isValid () {
    let validFormat = phoneNumberRegex.test(this.phoneNumber)
    if (validFormat && vxm.clubbers.clubbers[this.cid].parents?.includes(this.phoneNumber)) {
      validFormat = false
      this.erroMessage = 'Number already connected'
    } else {
      this.erroMessage = ''
    }
    return validFormat
  }

  async add () {
    if (this.isValid) {
      this.close(this.phoneNumber)
    }
  }

  @Emit()
  close (phoneNumber?: string) {
    return phoneNumber ?? null
  }
}
</script>
