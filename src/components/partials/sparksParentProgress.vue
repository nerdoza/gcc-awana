<template>
  <v-container class="parent-clubber-list pa-0">
    <v-row v-if="flightUndetermined">
      <v-col cols="12">
        <div class="text-h6">Was this child given a Flight 3:16 booklet to start with?</div>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="setSkipFlight(true)">No</v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-btn color="primary" @click="setSkipFlight(false)">Yes</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="!flightUndetermined">
      <v-col cols="auto">
        <v-progress-circular
          :rotate="-90"
          :size="80"
          :width="12"
          :value="percentageCompleted"
          :color="inReview? 'amber' : 'primary'"
        >{{segmentsCompletedRelative}}/{{segmentsRequiredRelative}}</v-progress-circular>
      </v-col>
      <v-col cols="auto">
        <div>Current {{ readyForReview ? 'Review' : ''}} Section</div>
        <div class="text-h5">
          <v-icon v-if="completed" color="yellow darken-3" size="30">$award</v-icon>
          {{ currentSectionLabel }}
        </div>
      </v-col>
    </v-row>
    <v-item-group
      v-model="sectionSteps"
      multiple
      class="section-steps"
      ref="section-steps"
      v-if="!flightUndetermined"
    >
      <v-container class="pa-0">
        <v-row>
          <v-expand-transition>
            <v-col cols="12" v-if="isFirstSection" align="center">
              <v-chip color="primary" pill>Tap sections as they are completed</v-chip>
            </v-col>
          </v-expand-transition>
          <v-col v-for="(n, index) in currentSectionSize" :key="index" cols="auto" class="pa-2">
            <v-item v-slot:default="{ active }">
              <v-card
                class="text-center rounded-circle d-flex align-center justify-center"
                :color="active ? (inReview ? 'amber' : 'primary') : ''"
                height="60"
                width="60"
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
    <v-overlay :value="confetti" ref="confetti-root">
      <v-icon size="100" color="yellow">$stars</v-icon>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { confetti } from 'dom-confetti'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import { getSparksFocusSection, getSparksSectionLabel, getSparksSegmentsCompleted, getSparksSegmentsRequired, now, sparksBookRequirements, sparksTotalSegmentsRequirementsPerPass } from '@/const'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Ref('confetti-root') readonly confettiRootComponent!: Vue
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  sectionSteps: number[] = []
  confetti = false

  get flightUndetermined () {
    return typeof this.record.book.skipFlight === 'undefined'
  }

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

  get completed () {
    return typeof this.record.book.completed === 'string'
  }

  get segmentsRequired () {
    return getSparksSegmentsRequired(this.record.book)
  }

  get segmentsRequiredRelative () {
    if (this.inReview) {
      return sparksTotalSegmentsRequirementsPerPass
    }
    return getSparksSegmentsRequired(this.record.book)
  }

  get segmentsCompleted () {
    return getSparksSegmentsCompleted(this.record.book)
  }

  get segmentsCompletedRelative () {
    if (this.inReview) {
      return this.segmentsCompleted - this.segmentsRequired
    }
    return this.segmentsCompleted
  }

  get readyForReview () {
    return this.segmentsCompleted >= this.segmentsRequired
  }

  get inReview () {
    return this.segmentsCompleted > this.segmentsRequired
  }

  get isFirstSection () {
    return this.segmentsCompleted === 0
  }

  get percentageCompleted () {
    return Math.round((this.segmentsCompletedRelative / this.segmentsRequiredRelative) * 100)
  }

  async setSkipFlight (skipFlight: boolean) {
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: { ...this.record.book, skipFlight } })
  }

  async activate () {
    let sectionRecord = this.currentSectionRecord
    if (!Array.isArray(sectionRecord)) {
      sectionRecord = []
    }

    if (sectionRecord.length === this.currentSectionSize - 1) {
      this.celebrate()
    }

    const updatedBookRecord = { ...this.record.book, [this.currentSectionProp]: [...sectionRecord, now()] }
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
    if (this.currentSectionProp === 'completed') {
      await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: { ...this.record.book, completed: now() } })
    }
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

  celebrate () {
    this.confetti = true
    Vue.nextTick(() => {
      confetti(this.confettiRootComponent.$el as HTMLElement, {
        height: '20px',
        width: '20px'
      })
    })
    setTimeout(() => { this.confetti = false }, 3000)
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
