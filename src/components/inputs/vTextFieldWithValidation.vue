<template>
  <ValidationProvider mode="lazy" :name="$attrs.label" :rules="rules" v-slot="{ errors }">
    <v-text-field
      v-model.trim="innerValue"
      :error-messages="errors"
      v-bind="$attrs"
      v-on="$listeners"
    ></v-text-field>
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

  @Prop([String, Object]) readonly rules!: string | {required?: boolean, regex?: string | RegExp}
  @Prop([String]) readonly value!: string

  @Watch('innerValue')
  onInnerValueChanged (val: string) {
    this.$emit('input', val)
  }

  @Watch('value')
  onValueChanged (val: string) {
    this.innerValue = val
  }

  created () {
    this.innerValue = this.value
  }
}
</script>
