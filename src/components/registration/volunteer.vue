<template>
  <validation-observer ref="form">
    <v-form>
      <v-card class="mb-6" outlined elevation="2">
        <v-container>
          <v-row>
            <v-col cols="12" class="mb-0">
              <p>AWANA Club is made possible through awesome volunteer leadership. Perks of leading include:</p>
              <ul class="mb-4">
                <li>Playing a role in the beginning phases of discipleship</li>
                <li>Receive a $5 discount per a child</li>
                <li :class="{'red--text': highlight }">
                  Puggles program for 2-3 year olds (
                  <em>exclusively for leaders</em>)
                </li>
              </ul>
              <p class="mb-0">Would you like to be an AWANA Club leader?</p>
            </v-col>
            <v-col cols="4" sm="4" class="my-0 py-0">
              <v-radio-group-with-validation
                v-model="volunteerData.volunteerString"
                class="my-0 no-label"
                :rules="{required: true, oneOf:options}"
                label="Selection"
              >
                <v-radio label="Yes" value="y"></v-radio>
                <v-radio label="No" value="n"></v-radio>
              </v-radio-group-with-validation>
            </v-col>
            <v-col cols="8" sm="4" class="my-0 py-0">
              <v-select-with-validation
                v-if="volunteerData.volunteer"
                v-model.trim="volunteerData.club"
                :items="clubs"
                label="Preferred Club"
              />
            </v-col>
            <v-col cols="12" class="my-0">
              <p class="my-0">
                <v-chip class="mr-1" color="primary">Note:</v-chip>All Awana Club leaders must submit to a background check before working with children.
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate'
import { facade } from 'vue-input-facade'
import { Component, Ref, Vue } from 'vue-property-decorator'

import VRadioGroupWithValidation from '@/components/inputs/vRadioGroupWithValidation.vue'
import VSelectWithValidation from '@/components/inputs/vSelectWithValidation.vue'
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { clubs } from '@/const'
import { vxm } from '@/store'

@Component({
  directives: {
    facade
  },
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VSelectWithValidation,
    VRadioGroupWithValidation
  }
})
export default class extends Vue {
 @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>

  readonly clubs = clubs

  volunteerData = vxm.registration.volunteer
  childrenData = vxm.registration.childRegistrations

  get options () {
    return this.childrenData.hasPuggle ? ['y'] : ['y', 'n']
  }

  get highlight () {
    return this.volunteerData.volunteer === false && !this.volunteerData.isValid
  }

  async validate () {
    const formValidation = await this.form.validate()
    return this.volunteerData.isValid && formValidation
  }
}
</script>
