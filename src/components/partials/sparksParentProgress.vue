<template>
  <v-container class="sparks-parent-progress pa-0">
    <v-row v-if="progressStage === 'book'">
      <v-col cols="12">
        <div class="text-h6">Which book is this child working on?</div>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-btn block large color="white" @click="setBookNum(1)">
          <v-img :src="getSparksBookImg(1)" contain aspect-ratio="2.53" max-height="40"></v-img>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-btn block large color="white" @click="setBookNum(2)">
          <v-img :src="getSparksBookImg(2)" contain aspect-ratio="2.53" max-height="40"></v-img>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-btn block large color="white" @click="setBookNum(3)">
          <v-img :src="getSparksBookImg(3)" contain aspect-ratio="2.53" max-height="40"></v-img>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="progressStage === 'flight'">
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
    <v-row v-if="progressStage === 'progress'">
      <v-col cols="auto" class="pa-2">
        <v-progress-circular
          rotate="-90"
          :size="mediumRadialSize"
          width="8"
          :value="percentageCompleted"
          :color="inReview? 'amber' : 'primary'"
        >{{segmentsCompletedRelative}}/{{segmentsRequiredRelative}}</v-progress-circular>
      </v-col>
      <v-col cols="auto" align-self="center" class="pa-2">
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
      v-if="progressStage === 'progress'"
    >
      <v-container class="pa-0">
        <v-row>
          <v-expand-transition>
            <v-col cols="12" v-if="showTip" align="center" class="pt-0">
              <v-chip color="primary" pill>Tap section numbers as they are completed</v-chip>
            </v-col>
          </v-expand-transition>
          <v-col v-for="(n, index) in currentSectionSize" :key="index" cols="auto" class="pa-2">
            <v-item v-slot:default="{ active }">
              <v-card
                class="text-center rounded-circle d-flex align-center justify-center"
                :color="active ? (inReview ? 'amber' : 'primary') : ''"
                :height="mediumRadialSize"
                :width="mediumRadialSize"
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
    <v-overlay :value="celebrate" ref="celebrate-root">
      <v-card color="white" class="rounded-circle pa-6 align-center justify-center">
        <v-icon size="90" class="fa-fw" :color="celebrateColor" v-text="celebrateIcon"></v-icon>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { confetti } from 'dom-confetti'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import { mediumRadialSize, now } from '@/const'
import { getSparksBookImg, getSparksFocusSection, getSparksSectionLabel, getSparksSegmentsCompleted, getSparksSegmentsRequired, sparksBookRequirements, sparksTotalSegmentsRequirementsPerPass } from '@/lib/sparks'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Ref('celebrate-root') readonly confettiRootComponent!: Vue
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  readonly getSparksBookImg = getSparksBookImg
  readonly mediumRadialSize = mediumRadialSize

  sectionSteps: number[] = []
  celebrate = false
  celebrateIcon = ''
  celebrateColor = ''
  showTip = this.segmentsCompleted === 0

  get progressStage () {
    if (this.bookNumUndetermined) {
      return 'book'
    }
    if (this.flightUndetermined) {
      return 'flight'
    }
    return 'progress'
  }

  get bookNumUndetermined () {
    return typeof this.record.book.bookNum === 'undefined'
  }

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

  get percentageCompleted () {
    return Math.round((this.segmentsCompletedRelative / this.segmentsRequiredRelative) * 100)
  }

  getIcon (section: keyof SparksBook) {
    if (section.includes('Jewel')) {
      return '$gem'
    }
    if (section === 'flight') {
      return '$flight'
    }
    return '$bookmark'
  }

  getColor (section: keyof SparksBook) {
    if (section.includes('Review')) {
      return 'amber'
    }
    if (section.includes('red')) {
      return 'red'
    }
    if (section.includes('green')) {
      return 'green'
    }
    return 'primary'
  }

  async setSkipFlight (skipFlight: boolean) {
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: { ...this.record.book, skipFlight } })
  }

  async setBookNum (bookNum: number) {
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: { ...this.record.book, bookNum } })
  }

  async activate () {
    let sectionRecord = this.currentSectionRecord
    if (!Array.isArray(sectionRecord)) {
      sectionRecord = []
    }

    if (sectionRecord.length === this.currentSectionSize - 1) {
      this.doCelebration(this.currentSectionProp)
    }

    const updatedBookRecord = { ...this.record.book, [this.currentSectionProp]: [...sectionRecord, now()] }
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
    if (this.currentSectionProp === 'completed') {
      await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: { ...this.record.book, completed: now() } })
    }
  }

  async deactivate () {
    let sectionRecord = this.currentSectionRecord
    if (!Array.isArray(sectionRecord)) {
      sectionRecord = []
    } else {
      sectionRecord = [...sectionRecord]
      sectionRecord.pop()
    }

    const updatedBookRecord = { ...this.record.book, [this.currentSectionProp]: [...sectionRecord] }
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
  }

  doCelebration (sectionProp: keyof SparksBook) {
    this.celebrateIcon = this.getIcon(sectionProp)
    this.celebrateColor = this.getColor(sectionProp)
    this.celebrate = true
    Vue.nextTick(() => {
      confetti(this.confettiRootComponent.$el as HTMLElement, {
        height: '20px',
        width: '20px'
      })
    })
    setTimeout(() => { this.celebrate = false }, 3000)
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
.sparks-parent-progress {
  .section-steps {
    .v-card--link:focus:before {
      opacity: 0;
    }
  }
}
</style>
