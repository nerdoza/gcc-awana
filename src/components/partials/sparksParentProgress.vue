<template>
  <v-container class="sparks-parent-progress pa-0">
    <v-row v-if="progressStage === 'book'">
      <v-col cols="12">
        <div class="text-h6">Which book is this child working on?</div>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-btn block large color="white" @click="setBookNum(1)">
          <v-img :src="sparksBookImg(1)" contain aspect-ratio="2.53" max-height="40"></v-img>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-btn block large color="white" @click="setBookNum(2)">
          <v-img :src="sparksBookImg(2)" contain aspect-ratio="2.53" max-height="40"></v-img>
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-btn block large color="white" @click="setBookNum(3)">
          <v-img :src="sparksBookImg(3)" contain aspect-ratio="2.53" max-height="40"></v-img>
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
        <div>Current {{ inReview ? 'Review' : ''}} Section</div>
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
          <v-col
            v-for="(sectionNumber, index) in currentSectionSize"
            :key="index"
            cols="auto"
            class="pa-2"
          >
            <v-card
              class="section-props text-center rounded-circle d-flex align-center justify-center"
              :color="getValue(sectionNumber) ? 'primary': 'white'"
              :height="mediumRadialSize"
              :width="mediumRadialSize"
              @click="setProp(sectionNumber)"
            >
              <template v-if="getValue(sectionNumber)">
                <v-icon color="white">$check</v-icon>
              </template>
              <template v-else>
                <span class="display-1 font-weight-light">{{ sectionNumber }}</span>
              </template>
            </v-card>
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
import { sparksBookImg, sparksBookRequirements, sparksFocusSection, sparksReviewSegmentsCompleted, sparksSectionIsComplete, sparksSectionLabel, sparksSegmentsCompleted, sparksSegmentsRequired, sparksTotalSegmentsRequirementsPerPass } from '@/lib/sparks'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Ref('celebrate-root') readonly confettiRootComponent!: Vue
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  readonly sparksBookImg = sparksBookImg
  readonly mediumRadialSize = mediumRadialSize

  sectionSteps: number[] = []
  celebrate = false
  celebrateIcon = ''
  celebrateColor = ''
  showTip = sparksSegmentsCompleted(this.record.book) === 0

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
    return sparksFocusSection(this.record.book)
  }

  get currentSectionRecord () {
    return this.record.book[this.currentSectionProp]
  }

  get currentSectionSize () {
    return sparksBookRequirements[this.currentSectionProp]
  }

  get currentSectionLabel () {
    return sparksSectionLabel(this.currentSectionProp)
  }

  get completed () {
    return typeof this.record.book.completed === 'string'
  }

  get segmentsRequired () {
    return sparksSegmentsRequired(this.record.book)
  }

  get segmentsRequiredRelative () {
    if (this.inReview) {
      return sparksTotalSegmentsRequirementsPerPass
    }
    return sparksSegmentsRequired(this.record.book)
  }

  get segmentsCompletedRelative () {
    if (this.inReview) {
      return sparksReviewSegmentsCompleted(this.record.book)
    }
    return sparksSegmentsCompleted(this.record.book)
  }

  get inReview () {
    return this.currentSectionProp.includes('Review')
  }

  get percentageCompleted () {
    return Math.round((this.segmentsCompletedRelative / this.segmentsRequiredRelative) * 100)
  }

  getValue (sectionNum: number) {
    const sectionRecord = this.currentSectionRecord
    const sectionProp = ('s' + sectionNum) as keyof SparksSectionFour & keyof SparksSectionEight
    return typeof sectionRecord === 'object' && typeof sectionRecord[sectionProp] === 'string'
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

  async setProp (sectionNum: number) {
    if (this.showTip) {
      this.showTip = false
    }
    let celebrate: undefined | keyof SparksBook
    let currentSectionRecord = this.currentSectionRecord
    const currentSectionProp = this.currentSectionProp
    const propertyName = ('s' + sectionNum) as keyof SparksSectionFour & keyof SparksSectionEight
    const toValue = !this.getValue(sectionNum)

    if (typeof currentSectionRecord === 'object') {
      currentSectionRecord = { ...currentSectionRecord }
      if (toValue) {
        currentSectionRecord[propertyName] = now()
        if (sparksSectionIsComplete(currentSectionRecord, currentSectionProp)) {
          celebrate = currentSectionProp
        }
      } else {
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const { [propertyName]: _, ...currentSectionRecordMod } = currentSectionRecord
        currentSectionRecord = currentSectionRecordMod
      }
    } else {
      if (toValue) {
        currentSectionRecord = { [propertyName]: now() }
      } else {
        currentSectionRecord = {}
      }
    }

    const updatedBookRecord = { ...this.record.book, [currentSectionProp]: currentSectionRecord }
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
    if (typeof celebrate !== 'undefined') {
      this.doCelebration(celebrate)
    }
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
