<template>
  <v-container class="tnt-book-full-details pa-0">
    <v-row no-gutters>
      <v-img
        :src="tntBookImg"
        contain
        aspect-ratio="3.06"
        max-height="100"
      ></v-img>
    </v-row>
    <v-row class="px-2">
      <v-spacer></v-spacer>
      <v-col cols="auto" class="text-center px-0">
        <v-progress-circular
          rotate="-90"
          :size="largeRadialSize"
          width="12"
          :value="percentageCompleted"
          color="primary"
          >{{ sectionsCompleted }}/{{ tntTotalSections }}</v-progress-circular
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="text-center px-0">
        <v-progress-circular
          rotate="-90"
          :size="largeRadialSize"
          width="12"
          :value="silverPercentageCompleted"
          :color="tntPropertyColor('silver')"
          >{{ silverCompleted }}/{{ tntTotalSections }}</v-progress-circular
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="text-center px-0">
        <v-progress-circular
          rotate="-90"
          :size="largeRadialSize"
          width="12"
          :value="goldPercentageCompleted"
          :color="tntPropertyColor('gold')"
          >{{ goldCompleted }}/{{ tntTotalSections }}</v-progress-circular
        >
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row>
      <v-col cols="auto" class="pt-0" align-self="center">
        <div class="text-h6">Awana Bucks Earned:</div>
        <div class="text-h5" v-text="bucksEarned"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <div>Current Section</div>
        <div class="text-h5" v-html="currentSectionLabel"></div>
      </v-col>
    </v-row>
    <v-row v-for="(date, index) of tntBookDates" :key="index">
      <v-col cols="12" class="pa-0">
        <v-divider></v-divider>
        <v-list-item two-line class="px-3">
          <v-list-item-content class="pa-0">
            <v-list-item-title
              v-html="tntSectionLabel(tntBookSchedule[date])"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-text="getLongDate(date)"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col
        v-for="(propertyName, index) of tntSectionProperties"
        :key="index"
        cols="auto"
        class="px-2 pt-0"
      >
        <v-card
          class="section-props text-center rounded-circle d-flex align-center justify-center"
          :color="
            getValue(tntBookSchedule[date], propertyName)
              ? tntPropertyColor(propertyName)
              : 'white'
          "
          :height="smallRadialSize"
          :width="smallRadialSize"
          @click="setProp(tntBookSchedule[date], propertyName)"
          :disabled="
            propertyName === 'review' &&
            tntSectionSkipReview(tntBookSchedule[date])
          "
        >
          <v-icon
            :color="
              getValue(tntBookSchedule[date], propertyName)
                ? 'white'
                : tntPropertyColor(propertyName, true)
            "
            small
            v-text="tntPropertyIcon(propertyName)"
          ></v-icon>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { format, parse } from 'date-fns'
import { Component, Prop, Vue } from 'vue-property-decorator'

import { largeRadialSize, now, smallRadialSize } from '@/const'
import { tntBookDates, tntBookImg, tntBookSchedule, tntBucksEarned, tntGoldsCompleted, tntKeyForDate, tntPropertyColor, tntPropertyIcon, tntSectionLabel, tntSectionProperties, tntSectionsCompleted, tntSectionSkipReview, tntSilversCompleted, tntTotalSections } from '@/lib/tnt'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: TnTBook}

  readonly tntBookImg = tntBookImg
  readonly tntTotalSections = tntTotalSections
  readonly tntBookDates = tntBookDates
  readonly tntBookSchedule = tntBookSchedule
  readonly tntSectionLabel = tntSectionLabel
  readonly tntSectionSkipReview = tntSectionSkipReview
  readonly tntSectionProperties = tntSectionProperties
  readonly tntPropertyIcon = tntPropertyIcon
  readonly tntPropertyColor = tntPropertyColor
  readonly largeRadialSize = largeRadialSize
  readonly smallRadialSize = smallRadialSize

  get currentKey () {
    return tntKeyForDate(new Date())
  }

  get currentSection () {
    return tntBookSchedule[this.currentKey]
  }

  get currentSectionLabel () {
    return tntSectionLabel(this.currentSection)
  }

  get sectionsCompleted () {
    return tntSectionsCompleted(this.record.book)
  }

  get percentageCompleted () {
    return Math.round((this.sectionsCompleted / tntTotalSections) * 100)
  }

  get silverCompleted () {
    return tntSilversCompleted(this.record.book)
  }

  get silverPercentageCompleted () {
    return Math.round((this.silverCompleted / tntTotalSections) * 100)
  }

  get goldCompleted () {
    return tntGoldsCompleted(this.record.book)
  }

  get goldPercentageCompleted () {
    return Math.round((this.goldCompleted / tntTotalSections) * 100)
  }

  get bucksEarned () {
    return tntBucksEarned(this.record.book)
  }

  getValue (section: keyof TnTBook, propertyName: keyof TnTBookSection) {
    const sectionRecord = this.record.book[section]
    if (typeof sectionRecord === 'object') {
      return typeof sectionRecord[propertyName] === 'string'
    }
    return false
  }

  getLongDate (date: string) {
    return format(parse(date, 'MM/dd/yyyy', new Date()), 'MMM do')
  }

  async setProp (section: keyof TnTBook, propertyName: keyof TnTBookSection) {
    const toValue = !this.getValue(section, propertyName)

    let currentSectionRecord = this.record.book[section]

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
.tnt-book-full-details {
  .section-props {
    &.v-card--link:focus:before {
      opacity: 0;
    }

    &.v-card--disabled {
      background-color: #fafafa !important;

      .v-icon {
        color: #e0e0e0 !important;
      }
    }
  }
}
</style>
