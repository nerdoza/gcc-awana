<template>
  <v-container class="pa-0">
    <v-row no-gutters>
      <v-img :src="bookImg" contain aspect-ratio="2.53" max-height="100"></v-img>
    </v-row>
    <v-row>
      <v-col cols="auto" class="pt-0 text-center">
        <v-progress-circular
          rotate="-90"
          :size="largeRadialSize"
          width="12"
          :value="percentageCompleted"
          :color="inReview? 'amber' : 'primary'"
        >{{segmentsCompletedRelative}}/{{segmentsRequiredRelative}}</v-progress-circular>
      </v-col>
      <v-col cols="auto" class="pt-0" align-self="center">
        <div>Current {{ readyForReview ? 'Review' : ''}} Section</div>
        <div class="text-h5">
          <v-icon v-if="completed" color="yellow darken-3" size="30">$award</v-icon>
          {{ currentSectionLabel }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-expansion-panels inset>
        <v-expansion-panel v-for="(section, index) in getCurrentBookSections()" :key="index">
          <template v-if="section === 'rankTestReview'">
            <v-subheader class="text-h5">
              <v-icon class="mr-2" color="amber">$award</v-icon>Review
            </v-subheader>
          </template>
          <v-expansion-panel-header :color="lastActiveSection === section ? 'grey lighten-4' : ''">
            <v-row no-gutters class="align-center">
              <v-col cols="auto">
                <v-icon :color="getColor(section)" v-text="getIcon(section)" class="fa-fw mr-2"></v-icon>
              </v-col>
              <v-col cols="auto">
                <v-progress-circular
                  rotate="-90"
                  :size="smallRadialSize"
                  width="2"
                  :value="getSectionPercentage(section)"
                  :color="getColor(section)"
                  class="mr-2"
                >{{ getSectionCompletion(section) }}/{{ getSectionSize(section) }}</v-progress-circular>
              </v-col>
              <v-col cols="auto">
                <div v-text="getLabel(section)"></div>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-card
              v-for="(n, index) in getSectionSize(section)"
              :key="index"
              class="text-center rounded-circle d-inline-flex align-center justify-center ma-2"
              :color="getSectionSegmentStatus(section, index) ? 'primary' : ''"
              :height="smallRadialSize"
              :width="smallRadialSize"
            >
              <template v-if="lastActiveSection === section && isLastSegment(section, index)">
                <div v-if="promptForRemove" @click="remove()">
                  <v-icon color="white">$close</v-icon>
                </div>
                <div
                  v-else
                  class="font-weight-heavy white--text"
                  @click="prompt()"
                >{{ getSectionSegmentStatusText(section, index) }}</div>
              </template>
              <template v-else-if="getSectionSegmentStatus(section, index)">
                <div
                  class="font-weight-heavy white--text"
                >{{ getSectionSegmentStatusText(section, index) }}</div>
              </template>
              <template v-else>
                <div class="font-weight-light">{{ n }}</div>
              </template>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { format, parse } from 'date-fns'
import { Component, Prop, Vue } from 'vue-property-decorator'

import { largeRadialSize, smallRadialSize } from '@/const'
import { getSparksBookImg, getSparksFocusSection, getSparksSectionLabel, getSparksSegmentsCompleted, getSparksSegmentsRequired, sparksBookRequirements, sparksBookSectionOrder, sparksTotalSegmentsRequirementsPerPass } from '@/lib/sparks'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  readonly largeRadialSize = largeRadialSize
  readonly smallRadialSize = smallRadialSize

  promptForRemove = false
  promptForRemoveTimeout: number | null = null

  get bookImg () {
    return getSparksBookImg(this.record.book.bookNum || 0)
  }

  get bookSections () {
    const sections = [...sparksBookSectionOrder]
    if (this.record.book.skipFlight !== true) {
      sections.unshift('flight')
    }
    return sections
  }

  get lastActiveSection () {
    const bookSections = this.bookSections
    let lastActive = bookSections[0]

    this.bookSections.find(section => {
      const sectionRecord = this.record.book[section]
      if (typeof sectionRecord === 'object' && sectionRecord.length > 0) {
        lastActive = section
      } else {
        return true
      }
    })
    return lastActive
  }

  get inReview () {
    return this.lastActiveSection.includes('Review')
  }

  get readyForReview () {
    return this.segmentsCompleted >= this.segmentsRequired
  }

  get completed () {
    return typeof this.record.book.completed === 'string'
  }

  get currentSectionProp () {
    return getSparksFocusSection(this.record.book)
  }

  get currentSectionLabel () {
    return getSparksSectionLabel(this.currentSectionProp)
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

  get percentageCompleted () {
    return Math.round((this.segmentsCompletedRelative / this.segmentsRequiredRelative) * 100)
  }

  getCurrentBookSections () {
    const sections = this.bookSections
    const inReview = this.inReview
    return sections.filter(section => {
      return (section.includes('Review') && inReview) || !section.includes('Review')
    })
  }

  isLastSegment (section: keyof SparksBook, segment: number) {
    const lastSection = this.lastActiveSection
    if (section === lastSection) {
      const sectionRecord = this.record.book[section]
      return typeof sectionRecord === 'object' && (sectionRecord.length - 1) === segment
    }
    return false
  }

  prompt () {
    this.promptForRemove = true
    this.promptForRemoveTimeout = window.setTimeout(() => { this.promptForRemove = false }, 3000)
  }

  async remove () {
    const targetSection = this.lastActiveSection
    let sectionRecord = this.record.book[targetSection]
    if (!Array.isArray(sectionRecord)) {
      sectionRecord = []
    } else {
      sectionRecord = [...sectionRecord]
      sectionRecord.pop()
    }

    const updatedBookRecord = { ...this.record.book, [targetSection]: [...sectionRecord] }
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
    if (this.promptForRemoveTimeout !== null) {
      clearTimeout(this.promptForRemoveTimeout)
    }
    this.promptForRemove = false
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

  getLabel (section: keyof SparksBook) {
    return getSparksSectionLabel(section)
  }

  getSectionSize (section: keyof SparksBook) {
    return sparksBookRequirements[section]
  }

  getSectionCompletion (section: keyof SparksBook) {
    const sectionRecord = this.record.book[section]
    return typeof sectionRecord === 'object' ? sectionRecord.length : 0
  }

  getSectionPercentage (section: keyof SparksBook) {
    return Math.round(this.getSectionCompletion(section) / this.getSectionSize(section) * 100)
  }

  getSectionSegmentStatus (section: keyof SparksBook, segment: number) {
    const sectionRecord = this.record.book[section]
    return typeof sectionRecord === 'object' && typeof sectionRecord[segment] === 'string'
  }

  getSectionSegmentStatusText (section: keyof SparksBook, segment: number) {
    const sectionRecord = this.record.book[section]
    return typeof sectionRecord === 'object' && typeof sectionRecord[segment] === 'string' ? format(parse(sectionRecord[segment], 'MM/dd/yyyy', new Date()), 'M/d') : ''
  }
}
</script>
