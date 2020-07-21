<template>
  <ValidationProvider mode="lazy" :name="$attrs.label" :rules="rules" v-slot="{ errors }">
    <v-radio-group
      v-model.trim="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot></slot>
    </v-radio-group>
  </ValidationProvider>
</template>

<script lang="ts">
import { ValidationProvider } from 'vee-validate'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    ValidationProvider
  }
})
export default class extends Vue {
  innerValue = ''

  @Prop([String, Object]) readonly rules!: string | {required?: boolean}
  @Prop([String]) readonly value!: string

  @Watch('innerValue')
  onInnerValueChanged (val: string) {
    this.$emit('input', val)
  }

  @Watch('value')
  onValueChanged (value: string) {
    this.innerValue = value
  }

  created () {
    this.innerValue = this.value
  }
}
</script>
