<template>
  <v-card tile class="edit-clubber-card">
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>Clubber</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="close">
        <v-icon>$close</v-icon>
      </v-btn>
    </v-toolbar>
    <validation-observer ref="form">
      <v-form @submit.prevent="trySave">
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field-with-validation
                label="First Name"
                v-model="rawClubber.firstName"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field-with-validation
                label="Last Name"
                v-model="rawClubber.lastName"
                rules="required"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field-with-validation
                label="Birthday"
                hint="MM/DD/YYYY"
                type="tele"
                v-model="rawClubber.birthday"
                v-facade="dateOfBirthMask"
                :rules="{ required: true, regex: dateOfBirthRegex }"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select-with-validation
                v-model="rawClubber.gender"
                rules="required"
                :items="genderSelect"
                label="Gender"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select-with-validation
                v-model="rawClubber.grade"
                rules="required"
                :items="gradeSelect"
                label="Grade"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select-with-validation
                v-model="rawClubber.club"
                rules="required"
                :items="clubSelect"
                label="Club"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select label="Leader" v-model="rawClubber.leader" :items="leaderSelect"></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </validation-observer>
    <v-divider></v-divider>
    <v-subheader>Parents</v-subheader>
    <v-list-item
      v-for="parent in parents"
      :key="parent.phoneNumber"
      @mouseover="parentHover = parent.phoneNumber"
      @mouseleave="parentHover = ''"
    >
      <v-list-item-avatar
        :rounded="false"
        @click="callParent(parent.phoneNumber)"
        :color="parentHover !== parent.phoneNumber ? 'grey lighten-2' : ''"
      >
        <v-icon v-if="parentHover !== parent.phoneNumber">$user</v-icon>
        <v-icon dense color="primary" class="call" v-else>$call</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="parent.firstName + ' ' + parent.lastName"></v-list-item-title>
        <v-list-item-subtitle v-text="parent.phoneNumber"></v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-action>
        <v-dialog v-model="removeParentDialog" persistent max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>$removeUser</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">Remove Parent</v-card-title>
            <v-card-text>
              This will remove this user's access to this clubber's information.
              <br />
              <br />Are you sure you want to do this?
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="removeParentDialog = false">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="removeParent(parent.phoneNumber)">Remove</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-item-action>
    </v-list-item>
    <v-dialog v-model="addParentDialog" persistent max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item v-bind="attrs" v-on="on">
          <v-list-item-avatar color="grey lighten-2">
            <v-icon dense>$plus</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Add Parent</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-card>
        <v-card-title class="headline">Add Parent</v-card-title>
        <v-card-text>
          <v-text-field
            label="Phone Number"
            name="phone"
            prepend-icon="$phone"
            type="tel"
            v-facade="phoneNumberMask"
            v-model.trim="addParentPhoneNumber"
            autofocus
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="dismissAddParentDialog">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="addParent" :disabled="!addParentPhoneNumberValid">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-divider class="mb-2"></v-divider>
    <v-card-actions>
      <v-dialog v-model="removeClubberDialog" persistent max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ma-2 secondary" v-bind="attrs" v-on="on">
            <v-icon class="mr-2">$trash</v-icon>Delete
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">Delete Clubber</v-card-title>
          <v-card-text>
            This will completely remove this clubber from the system and destroy all their data.
            <br />
            <br />Are you sure you want to do this?
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="removeClubberDialog = false">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="removeClubber">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { debounce } from 'ts-debounce'
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { clubSelect, dateOfBirthMask, dateOfBirthRegex, firestoreCollections, genderSelect, gradeSelect, phoneNumberMask, phoneNumberRegex } from '@/const'
import firebaseProject from '@/plugins/firebase'

@Component({
  directives: {
    facade
  },
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VSelectWithValidation
  }
})
export default class extends Vue {
  @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>
  @Prop() readonly clubber!: {uid: string, clubber: Clubber}
  @Prop() readonly leaders!: {[key in Club]: {[index: string]: User}}

  readonly clubSelect = clubSelect
  readonly genderSelect = genderSelect
  readonly gradeSelect = gradeSelect
  readonly dateOfBirthMask = dateOfBirthMask
  readonly dateOfBirthRegex = dateOfBirthRegex
  readonly phoneNumberMask = phoneNumberMask

  rawUid = this.clubber.uid
  removeClubberDialog = false

  rawClubber = {
    firstName: this.clubber.clubber.firstName,
    lastName: this.clubber.clubber.lastName,
    birthday: this.clubber.clubber.birthday,
    gender: this.clubber.clubber.gender,
    grade: this.clubber.clubber.grade,
    club: this.clubber.clubber.club,
    leader: this.clubber.clubber.leader ?? '',
    parents: [...(this.clubber.clubber.parents ?? [])]
  }

  parents: User[] = []
  parentHover = ''
  addParentDialog = false
  removeParentDialog = false
  addParentPhoneNumber = ''

  readonly debouncedUpdate = debounce(({ uid, clubber }: {uid: string, clubber: Clubber}) => {
    void firebaseProject.updateDocument(uid, firestoreCollections.clubbers, clubber)
  }, 500)

  get leaderSelect () {
    if (this.rawClubber.club !== '') {
      return Object.keys(this.leaders[this.rawClubber.club]).map(key => ({
        value: key,
        text: this.leaders[this.rawClubber.club][key].firstName + ' ' + this.leaders[this.rawClubber.club][key].lastName
      }))
    }
    return []
  }

  async validate () {
    return await this.form.validate()
  }

  callParent (number: string) {
    window.location.href = 'tel:' + number
  }

  addParent () {
    this.rawClubber.parents.push(this.addParentPhoneNumber)
    this.dismissAddParentDialog()
  }

  dismissAddParentDialog () {
    this.addParentDialog = false
    this.addParentPhoneNumber = ''
  }

  get addParentPhoneNumberValid () {
    return phoneNumberRegex.test(this.addParentPhoneNumber)
  }

  async removeParent (number: string) {
    this.removeParentDialog = false
    this.$delete(this.rawClubber.parents, this.rawClubber.parents.indexOf(number))
  }

  async setParents (parentPhoneNumbers: string[]) {
    if (parentPhoneNumbers.length > 0) {
      const parents = await firebaseProject.getCollection(firestoreCollections.users, {
        where: [
          { fieldPath: 'phoneNumber', opStr: 'in', value: parentPhoneNumbers }
        ]
      }) as {[index: string]: User}
      this.parents = Object.keys(parents).map(key => parents[key])
      parentPhoneNumbers.forEach(phoneNumber => {
        if (!this.parents.find(user => user.phoneNumber === phoneNumber)) {
          this.parents.push({ firstName: '', lastName: '', phoneNumber } as User)
        }
      })
    } else {
      this.parents = []
    }
  }

  @Watch('clubber', { deep: true, immediate: true })
  async onClubberChanged ({ uid, clubber }: {uid: string, clubber: Clubber}) {
    this.rawUid = uid
    this.rawClubber.firstName = clubber.firstName
    this.rawClubber.lastName = clubber.lastName
    this.rawClubber.birthday = clubber.birthday
    this.rawClubber.gender = clubber.gender
    this.rawClubber.grade = clubber.grade
    this.rawClubber.club = clubber.club
    this.rawClubber.leader = clubber.leader ?? ''
    this.rawClubber.parents = [...(this.clubber.clubber.parents ?? [])]
  }

  @Watch('rawClubber', { deep: true })
  async onRawClubberChanged (clubber: Clubber) {
    if (await this.validate()) {
      if (clubber.club !== this.clubber.clubber.club) {
        clubber.leader = ''
      }
      this.update({ uid: this.rawUid, clubber: { ...clubber } })
      this.debouncedUpdate({ uid: this.rawUid, clubber: { ...clubber } })
    }
  }

  @Watch('rawClubber.parents', { immediate: true })
  async onRawClubberParentsChanged (parents: string[]) {
    await this.setParents(parents)
  }

  @Emit()
  update (clubber: {uid: string, clubber: Clubber}) {
    return clubber
  }

  @Emit()
  close () {
    return undefined
  }

  async removeClubber () {
    this.removeClubberDialog = false
    await firebaseProject.deleteDocument(this.rawUid, firestoreCollections.clubbers)
    this.destroy(this.rawUid)
  }

  @Emit()
  destroy (uid: string) {
    return uid
  }
}
</script>

<style lang="scss">
.edit-clubber-card {
  .call {
    cursor: pointer;

    &.v-icon.v-icon {
      border-radius: 0;
    }
  }
}
</style>
