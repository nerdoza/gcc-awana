<template>
  <validation-observer ref="form">
    <v-form>
      <v-card class="mb-6" outlined elevation="2">
        <v-container>
          <v-row>
            <v-col cols="12" class="mb-0">
              <ol class="mb-4">
                <li class="mb-2">
                  I understand that my child/children may participate in physical activities such as those held during Game Time. As with any
                  physical activity, there is a risk of injury. I fully accept this risk and hold harmless from any legal liability Grace Community
                  Church and any persons involved in the Awana Club ministry.
                </li>
                <li class="mb-2">
                  In the event of an emergency that requires medical treatment for the above named child/children, I understand every effort will
                  be made to contact me or my emergency contact. However, if I/we cannot be reached, I give my permission to the AWANA
                  volunteers to secure the services of a licensed physician to provide the care necessary for my child's well being. I assume
                  responsibility for all costs connected to any accident or treatment of my child.
                </li>
                <li class="mb-2">
                  <v-radio-group-with-validation
                    v-model="termsData.photoApprovalString"
                    class="my-0 dark-label"
                    rules="required"
                    label="Photo Permissions"
                  >
                    <v-radio
                      label="I grant permission for GCC to post photos that include my children on the GCC website. I understand that, at any time, I can
rescind my permission by submitting a written request to Grace Community Church"
                      value="y"
                    ></v-radio>
                    <v-radio
                      label="I DO NOT give my permission to GCC to post photos of my children."
                      value="n"
                    ></v-radio>
                  </v-radio-group-with-validation>
                </li>
              </ol>
              <v-checkbox
                class="dark-label"
                v-model="termsData.approvedTerms"
                label="I have read and agree to the Terms &amp; Conditions stated above."
              ></v-checkbox>
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
import VTextFieldWithValidation from '@/components/inputs/vTextFieldWithValidation.vue'
import { vxm } from '@/store'

@Component({
  directives: {
    facade
  },
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    VRadioGroupWithValidation
  }
})
export default class extends Vue {
  @Ref('form') readonly form!: InstanceType<typeof ValidationObserver>

  termsData = vxm.registration.terms

  async validate () {
    const formValidation = await this.form.validate()
    return this.termsData.isValid && formValidation
  }
}
</script>
