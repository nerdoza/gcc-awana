<template>
  <v-container class="sparks-book-full-details pa-0">
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
        <div>Current {{ inReview ? 'Review' : ''}} Section</div>
        <div class="text-h5">
          <v-icon v-if="completed" color="yellow darken-3" size="30">$award</v-icon>
          {{ currentSectionLabel }}
        </div>
      </v-col>
    </v-row>
    <v-row v-for="(section, index) in getCurrentBookSections()" :key="index">
      <template v-if="section === 'rankTestReview'">
        <v-col cols="12" class="pa-0">
          <v-divider></v-divider>
          <v-subheader class="text-h5">
            <v-icon class="mr-2" color="amber">$award</v-icon>Review
          </v-subheader>
        </v-col>
      </template>
      <v-col cols="12" class="pa-0">
        <v-divider></v-divider>
        <v-list-item class="px-3">
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              <v-row no-gutters class="align-center">
                <v-col cols="auto">
                  <v-icon :color="getColor(section)" v-text="getIcon(section)" class="fa-fw mr-2"></v-icon>
                </v-col>
                <v-col cols="auto">
                  <div v-text="getLabel(section)"></div>
                </v-col>
              </v-row>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col :key="index" cols="auto" class="px-2 pt-0">
        <v-card
          v-for="(sectionNumber, index) in getSectionSize(section)"
          :key="index"
          class="section-props text-center rounded-circle d-inline-flex align-center justify-center ma-2"
          :color="getSectionSegmentStatus(section, sectionNumber) ? 'primary' : ''"
          :height="smallRadialSize"
          :width="smallRadialSize"
          @click="setProp(section, sectionNumber)"
        >
          <template v-if="getSectionSegmentStatus(section, sectionNumber)">
            <div
              class="font-weight-heavy white--text"
            >{{ getSectionSegmentStatusText(section, sectionNumber) }}</div>
          </template>
          <template v-else>
            <div class="font-weight-light">{{ sectionNumber }}</div>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { format, parse } from 'date-fns'
import { Component, Prop, Vue } from 'vue-property-decorator'

import { largeRadialSize, now, smallRadialSize } from '@/const'
import { sparksBookImg, sparksBookRequirements, sparksBookSectionOrder, sparksFocusSection, sparksReviewSegmentsCompleted, sparksSectionLabel, sparksSegmentsCompleted, sparksSegmentsRequired, sparksTotalSegmentsRequirementsPerPass } from '@/lib/sparks'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: SparksBook}

  readonly largeRadialSize = largeRadialSize
  readonly smallRadialSize = smallRadialSize

  get bookImg () {
    return sparksBookImg(this.record.book.bookNum || 0)
  }

  get bookSections () {
    const sections = [...sparksBookSectionOrder]
    if (this.record.book.skipFlight !== true) {
      sections.unshift('flight')
    }
    return sections
  }

  get completed () {
    return typeof this.record.book.completed === 'string'
  }

  get currentSectionProp () {
    return sparksFocusSection(this.record.book)
  }

  get currentSectionLabel () {
    return sparksSectionLabel(this.currentSectionProp)
  }

  get segmentsRequired () {
    return sparksSegmentsRequired(this.record.book)
  }

  get inReview () {
    return this.currentSectionProp.includes('Review')
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
    return sparksSectionLabel(section)
  }

  getSectionSize (section: keyof SparksBook) {
    return sparksBookRequirements[section]
  }

  getSectionSegmentStatus (section: keyof SparksBook, sectionNum: number) {
    const sectionRecord = this.record.book[section]
    const sectionProp = ('s' + sectionNum) as keyof SparksSectionFour & keyof SparksSectionEight
    return typeof sectionRecord === 'object' && typeof sectionRecord[sectionProp] === 'string'
  }

  getSectionSegmentStatusText (section: keyof SparksBook, sectionNum: number) {
    const sectionRecord = this.record.book[section]
    const sectionProp = ('s' + sectionNum) as keyof SparksSectionFour & keyof SparksSectionEight
    if (typeof sectionRecord === 'object') {
      const propRecord = sectionRecord[sectionProp]
      if (typeof propRecord === 'string') {
        return format(parse(propRecord, 'MM/dd/yyyy', new Date()), 'M/d')
      }
    }
    return ''
  }

  async setProp (section: keyof SparksBook, sectionNum: number) {
    const toValue = !this.getSectionSegmentStatus(section, sectionNum)

    let currentSectionRecord = this.record.book[section]
    const propertyName = ('s' + sectionNum) as keyof SparksSectionFour & keyof SparksSectionEight

    if (typeof currentSectionRecord === 'object') {
      currentSectionRecord = { ...currentSectionRecord }
      if (toValue) {
        currentSectionRecord[propertyName] = now()
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

    const updatedBookRecord = { ...this.record.book, [section]: currentSectionRecord }
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
  }
}
</script>

<style lang="scss">
.sparks-book-full-details {
  .section-props {
    &.v-card--link:focus:before {
      opacity: 0;
    }
  }
}
</style>
