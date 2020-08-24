<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create Notification</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$close</v-icon>
            </v-btn>
          </v-toolbar>
          <validation-observer ref="form">
            <v-form @submit.prevent="trySave">
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field-with-validation label="Title" v-model="title" rules="required" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea-with-validation label="Message" v-model="text" rules="required" />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </validation-observer>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              class="mr-2 mb-2"
              :disabled="creating"
              :loading="creating"
              @click="createNotification"
            >
              <v-icon class="mr-2">$addNotification</v-icon>Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { Component, Ref, Vue } from 'vue-property-decorator'

import VTextareaWithValidation from '@/components/inputs/vTextareaWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { vxm } from '@/store'

@Component({
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VTextareaWithValidation
  }
})
export default class extends Vue {
  @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>
  creating = false

  title =''
  text = ''

  async validate () {
    return await this.form.validate()
  }

  async createNotification () {
    if (await this.validate()) {
      this.creating = true
      const nid = await vxm.notifications.createNotification({ title: this.title, text: this.text })
      this.$router.replace({ name: 'NotificationEdit', params: { nid } })
    }
  }

  close () {
    this.$router.go(-1)
  }
}
</script>
