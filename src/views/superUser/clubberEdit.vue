<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="4">
        <v-card tile id="super-clubber-edit-view">
          <v-toolbar flat dark color="primary">
            <v-toolbar-title>Edit Clubber</v-toolbar-title>
            <v-btn icon class="ml-2" @click="refreshData">
              <v-icon v-bind:class="{ 'fa-spin': loading }">$sync</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="close">
              <v-icon>$left</v-icon>
            </v-btn>
          </v-toolbar>
          <validation-observer ref="form">
            <v-form @submit.prevent="trySave">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field-with-validation
                      label="First Name"
                      v-model="clubber.firstName"
                      rules="required"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field-with-validation
                      label="Last Name"
                      v-model="clubber.lastName"
                      rules="required"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field-with-validation
                      label="Birthday"
                      hint="MM/DD/YYYY"
                      type="tele"
                      v-model="clubber.birthday"
                      v-facade="birthdayMask"
                      :rules="{ required: true, regex: birthdayRegex }"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select-with-validation
                      v-model="clubber.gender"
                      rules="required"
                      :items="genderSelect"
                      label="Gender"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-select-with-validation
                      v-model="clubber.grade"
                      rules="required"
                      :items="gradeSelect"
                      label="Grade"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select-with-validation
                      v-model="clubber.club"
                      rules="required"
                      :items="clubSelect"
                      disabled
                      label="Club"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select
                      label="Leader"
                      v-model="clubber.leader"
                      :items="leaderSelect"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </validation-observer>
          <v-divider></v-divider>
          <v-subheader>Parents</v-subheader>
          <v-container class="pt-0">
            <v-row>
              <v-col
                cols="12"
                md="6"
                v-for="(parent, index) in parents"
                :key="index"
              >
                <v-list-item>
                  <v-hover v-slot:default="{ hover }">
                    <v-list-item-avatar
                      :rounded="false"
                      @click="callParent(parent.phoneNumber)"
                      color="grey lighten-2"
                    >
                      <v-icon color="primary" class="call" v-if="hover"
                        >$call</v-icon
                      >
                      <v-icon v-else>$user</v-icon>
                    </v-list-item-avatar>
                  </v-hover>

                  <v-list-item-content>
                    <v-list-item-title
                      v-text="parent.fullName"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      v-text="parent.phoneNumber"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-dialog
                      v-model="removeParentDialogs[index]"
                      persistent
                      max-width="290"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on="on">
                          <v-icon>$removeUser</v-icon>
                        </v-btn>
                      </template>
                      <remove-parent-card
                        :parent="parent"
                        v-on:remove="removeParent"
                        v-on:close="removeParentDialogs[index] = false"
                      ></remove-parent-card>
                    </v-dialog>
                  </v-list-item-action>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-dialog v-model="addParentDialog" persistent max-width="290">
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on">
                      <v-list-item-avatar color="grey lighten-2">
                        <v-icon dense>$plus</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>Add Parent</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  <add-parent-card
                    v-if="addParentDialog"
                    :cid="this.cid"
                    v-on:close="addParentDialogClosed"
                  ></add-parent-card>
                </v-dialog>
              </v-col>
            </v-row>
          </v-container>
          <v-divider class="mb-2"></v-divider>
          <v-card-actions>
            <v-dialog v-model="removeClubberDialog" persistent max-width="290">
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="ma-2 secondary" v-bind="attrs" v-on="on">
                  <v-icon class="mr-2">$trash</v-icon>Delete
                </v-btn>
              </template>
              <remove-clubber-card
                :clubber="clubber"
                v-on:remove="removeClubber"
                v-on:close="removeClubberDialog = false"
              ></remove-clubber-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-btn
              class="ma-2"
              color="primary"
              :to="{ name: 'SuperClubberProgress' }"
            >
              <v-icon class="mr-2">$card</v-icon>Progress
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import AddParentCard from '@/components/cards/addParentCard.vue'
import RemoveClubberCard from '@/components/cards/removeClubberCard.vue'
import RemoveParentCard from '@/components/cards/removeParentCard.vue'
import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { birthdayMask, birthdayRegex, clubSelect, genderSelect, getFullname, gradeSelect, oneHour } from '@/const'
import { vxm } from '@/store'

@Component({
  directives: {
    facade
  },
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VSelectWithValidation,
    AddParentCard,
    RemoveParentCard,
    RemoveClubberCard
  }
})
export default class extends Vue {
  @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>
  @Prop() readonly cid!: string

  readonly clubSelect = clubSelect
  readonly genderSelect = genderSelect
  readonly gradeSelect = gradeSelect
  readonly birthdayMask = birthdayMask
  readonly birthdayRegex = birthdayRegex

  loading = false
  addParentDialog = false
  removeClubberDialog = false
  removeParentDialogs: {[index: number]: boolean} = {}

  clubber = { ...vxm.clubbers.clubbers[this.cid], parents: [...vxm.clubbers.clubbers[this.cid].parents ?? []] }

  get leaderSelect () {
    if (this.clubber.club !== '') {
      return vxm.appUsers.usersList.filter(record => {
        return record.role.leader === true && record.role.club === this.clubber.club
      }).map(record => ({
        value: record.uid,
        text: getFullname(record.user)
      }))
    }
    return []
  }

  get parents (): {fullName: string, phoneNumber: string}[] {
    if (typeof this.clubber.parents !== 'undefined' && this.clubber.parents.length > 0) {
      return this.clubber.parents.map(phoneNumber => {
        const foundUser = vxm.appUsers.usersList.find(record => record.user.phoneNumber === phoneNumber)
        return { fullName: typeof foundUser !== 'undefined' ? getFullname(foundUser.user) : '', phoneNumber }
      })
    }
    return []
  }

  async refreshData () {
    this.loading = true
    await vxm.clubbers.getClubberRecord({ cid: this.cid })
    this.clubber = { ...vxm.clubbers.clubbers[this.cid], parents: [...vxm.clubbers.clubbers[this.cid].parents ?? []] }
    await vxm.appUsers.getAppUsers()
    this.loading = false
  }

  async mounted () {
    if (vxm.appUsers.sinceUpdate > oneHour) {
      await vxm.appUsers.getAppUsers()
    }
  }

  async validate () {
    return await this.form.validate()
  }

  close () {
    this.$router.go(-1)
  }

  callParent (number: string) {
    window.location.href = 'tel:' + number
  }

  addParentDialogClosed (phoneNumber?: string) {
    this.addParentDialog = false
    if (typeof phoneNumber === 'string') {
      this.clubber.parents.push(phoneNumber)
    }
  }

  async removeClubber () {
    await vxm.clubbers.deleteClubberRecord({ cid: this.cid })
    this.close()
  }

  removeParent (phoneNumber: string) {
    this.clubber.parents.splice(this.clubber.parents.indexOf(phoneNumber), 1)
  }

  @Watch('clubber', { deep: true })
  async onClubberChanged (clubber: Clubber) {
    if (await this.validate()) {
      await vxm.clubbers.updateClubber({ cid: this.cid, clubber: { ...clubber, parents: [...clubber.parents ?? []] } })
    }
  }
}
</script>

<style lang="scss">
#super-clubber-edit-view {
  .call {
    cursor: pointer;

    &.v-icon.v-icon {
      border-radius: 0;
    }
  }
}
</style>
