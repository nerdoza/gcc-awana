<template>
  <v-container class="parent-clubber-list pa-0">
    <v-row>
      <v-col cols="12" class="display-1">
        <span>{{ currentSectionLabel }}</span>
      </v-col>
    </v-row>
    <v-item-group v-model="sectionSteps" multiple class="section-steps">
      <v-container class="pa-0">
        <v-row>
          <v-col v-for="(n, index) in currentSectionSize" :key="index" cols="auto">
            <v-item v-slot:default="{ active }">
              <v-card
                class="text-center rounded-circle d-flex align-center justify-center"
                :color="active ? 'primary' : ''"
                height="64"
                width="64"
                @click="active ? deactivate() : activate()"
                :disabled="index !== currentStepIndex && index !== currentStepIndex - 1"
              >
                <template v-if="active">
                  <v-icon color="white">$check</v-icon>
                </template>
                <template v-else>
                  <span
                    :class="{'black--text': index === currentStepIndex, 'grey--text': index !== currentStepIndex}"
                    class="display-1 font-weight-light"
                  >{{ n }}</span>
                </template>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-container>
    </v-item-group>
    <v-overlay :value="celebrate">
      <v-btn icon @click="celebrate = false">
        <v-icon>$check</v-icon>
      </v-btn>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import { getSparksFocusSection, getSparksSectionLabel, now, sparksBookRequirements } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  sectionSteps: number[] = []
  celebrate = false

  get currentSectionProp () {
    return getSparksFocusSection(this.record.book)
  }

  get currentSectionRecord () {
    return this.record.book[this.currentSectionProp]
  }

  get currentSectionSize () {
    return sparksBookRequirements[this.currentSectionProp]
  }

  get currentSectionLabel () {
    return getSparksSectionLabel(this.currentSectionProp)
  }

  get currentStepIndex () {
    return Array.isArray(this.currentSectionRecord) ? (this.currentSectionRecord as string[]).length : 0
  }

  activate () {
    let sectionRecord = this.currentSectionRecord
    if (!Array.isArray(sectionRecord)) {
      sectionRecord = []
    }

    if (sectionRecord.length === this.currentSectionSize - 1) {
      this.celebrate = true
      setTimeout(() => Vue.set(this, 'celebrate', false), 6000)
    }

    const updatedBookRecord = { ...this.record.book, [this.currentSectionProp]: [...sectionRecord, now()] }
    vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
  }

  deactivate () {
    let sectionRecord = this.currentSectionRecord
    if (!Array.isArray(sectionRecord)) {
      sectionRecord = []
    } else {
      sectionRecord = [...sectionRecord]
      sectionRecord.pop()
    }

    const updatedBookRecord = { ...this.record.book, [this.currentSectionProp]: [...sectionRecord] }
    vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
  }

  @Watch('record.book', { deep: true, immediate: true })
  onBookChange (book: SparksBook) {
    let newSectionSteps: number[] = []
    const section = book[this.currentSectionProp]
    if (Array.isArray(section)) {
      newSectionSteps = section.map((value, index) => index)
    }
    Vue.set(this, 'sectionSteps', newSectionSteps)
  }

  @Watch('celebrate')
  onCelebrate (celebrate: boolean) {
    console.log('CELEBRATE!')
  }
}
</script>

<style lang="scss">
.parent-clubber-list {
  .section-steps {
    .v-card--link:focus:before {
      opacity: 0;
    }
  }
}
</style>
