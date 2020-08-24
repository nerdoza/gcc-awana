<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Draft Notification</v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$left</v-icon>
            </v-btn>
          </v-toolbar>
          <validation-observer ref="form">
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field-with-validation
                      label="Title"
                      v-model="notification.title"
                      rules="required"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea-with-validation
                      label="Message"
                      v-model="notification.text"
                      rules="required"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </validation-observer>
          <v-card-actions>
            <v-dialog v-model="deleteDialog" persistent max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-2 secondary" v-bind="attrs" v-on="on">
                  <v-icon class="mr-2">$trash</v-icon>Delete
                </v-btn>
              </template>
              <delete-notification-card v-on:remove="remove" v-on:close="deleteDialog = false"></delete-notification-card>
            </v-dialog>
            <v-spacer />
            <v-btn
              color="primary"
              class="ma-2"
              :disabled="!isValid || sending"
              :loading="sending"
              @click="send"
            >
              <v-icon class="mr-2">$send</v-icon>Send
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import DeleteNotificationCard from '@/components/cards/deleteNotificationCard.vue'
import VTextareaWithValidation from '@/components/inputs/vTextareaWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { vxm } from '@/store'

@Component({
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VTextareaWithValidation,
    DeleteNotificationCard
  }
})
export default class extends Vue {
  @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>
  @Prop() readonly nid!: string
  loading = false
  sending = false
  deleteDialog = false

  notification = { ...vxm.notifications.notifications[this.nid] }

  get isValid () {
    return this.notification.title !== '' && this.notification.text !== ''
  }

  async validate () {
    return await this.form.validate()
  }

  async refreshData () {
    this.loading = true
    await vxm.notifications.getNotification({ nid: this.nid })
    this.notification = { ...vxm.notifications.notifications[this.nid] }
    this.loading = false
  }

  close () {
    this.$router.go(-1)
  }

  async remove () {
    await vxm.notifications.deleteNotification({ nid: this.nid })
    this.close()
  }

  async send () {
    if (this.isValid && await this.validate()) {
      this.sending = true
      await vxm.notifications.sendNotification({ nid: this.nid })
      this.close()
    }
  }

 @Watch('notification', { deep: true })
  async onNotificationChanged (notification: AppNotification) {
    if (this.isValid && await this.validate()) {
      await vxm.notifications.updateNotification({ nid: this.nid, notification: { ...notification } })
    }
  }
}
</script>
