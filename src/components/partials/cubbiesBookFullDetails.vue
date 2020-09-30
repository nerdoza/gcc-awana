<template>
  <v-container class="cubbies-book-full-details pa-0">
    <v-row no-gutters>
      <v-img
        :src="cubbiesBookImg"
        contain
        aspect-ratio="4.6"
        max-height="100"
      ></v-img>
    </v-row>
    <v-row>
      <v-col cols="auto" class="pt-0">
        <v-progress-circular
          rotate="-90"
          :size="largeRadialSize"
          width="12"
          :value="percentageCompleted"
          color="primary"
          >{{ sectionsCompleted }}/{{
            cubbiesTotalSections
          }}</v-progress-circular
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="pt-0" align-self="center">
        <div>Awana Bucks</div>
        <div class="text-h5">
          <v-icon class="mr-2" color="primary">$buck</v-icon>{{ bucksEarned }}
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto" class="pt-0" align-self="center">
        <div>Current Section{{ currentSections.length > 1 ? "s" : "" }}</div>
        <div class="text-h5" v-html="currentSectionsLabel"></div>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <v-row v-for="(date, index) of cubbiesBookDates" :key="index">
      <v-col cols="12" class="pa-0">
        <v-divider></v-divider>
        <v-list-item class="px-3 pt-2 pb-0">
          <v-list-item-content class="pa-0">
            <v-list-item-title
              v-html="cubbiesSectionsLabel(cubbiesBookSchedule[date])"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-text="getLongDate(date)"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <template v-for="(section, secIndex) of cubbiesBookSchedule[date]">
        <v-divider vertical v-if="secIndex === 1" :key="secIndex"></v-divider>
        <template v-for="propertyName of cubbiesSectionProperties">
          <v-col :key="secIndex + propertyName" cols="auto" class="pa-2">
            <v-card
              class="section-props text-center rounded-circle d-flex align-center justify-center"
              :color="
                getValue(section, propertyName)
                  ? cubbiesSectionColor(section)
                  : 'white'
              "
              :height="smallRadialSize"
              :width="smallRadialSize"
              @click="setProp(section, propertyName)"
              :disabled="
                propertyName === 'review' && cubbiesSectionSkipReview(section)
              "
            >
              <v-icon
                :color="
                  getValue(section, propertyName)
                    ? 'white'
                    : cubbiesSectionColor(section, true)
                "
                small
                v-text="cubbiesPropertyIcon(propertyName)"
              ></v-icon>
            </v-card>
          </v-col>
        </template>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { format, parse } from 'date-fns'
import { Component, Prop, Vue } from 'vue-property-decorator'

import { largeRadialSize, now, smallRadialSize } from '@/const'
import { cubbiesBookDates, cubbiesBookImg, cubbiesBookSchedule, cubbiesBucksEarned, cubbiesKeyForDate, cubbiesPropertyIcon, cubbiesSectionColor, cubbiesSectionProperties, cubbiesSectionsCompleted, cubbiesSectionSkipReview, cubbiesSectionsLabel, cubbiesTotalSections } from '@/lib/cubbies'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: CubbiesBook}

  readonly cubbiesBookImg = cubbiesBookImg
  readonly cubbiesTotalSections = cubbiesTotalSections
  readonly cubbiesBookDates = cubbiesBookDates
  readonly cubbiesBookSchedule = cubbiesBookSchedule
  readonly cubbiesSectionsLabel = cubbiesSectionsLabel
  readonly cubbiesSectionSkipReview = cubbiesSectionSkipReview
  readonly cubbiesSectionProperties = cubbiesSectionProperties
  readonly cubbiesPropertyIcon = cubbiesPropertyIcon
  readonly cubbiesSectionColor = cubbiesSectionColor
  readonly largeRadialSize = largeRadialSize
  readonly smallRadialSize = smallRadialSize

  get currentKey () {
    return cubbiesKeyForDate(new Date())
  }

  get currentSections () {
    return cubbiesBookSchedule[this.currentKey]
  }

  get currentSectionsLabel () {
    return cubbiesSectionsLabel(this.currentSections)
  }

  get sectionsCompleted () {
    return cubbiesSectionsCompleted(this.record.book)
  }

  get percentageCompleted () {
    return Math.round((this.sectionsCompleted / cubbiesTotalSections) * 100)
  }

  get bucksEarned () {
    return cubbiesBucksEarned(this.record.book)
  }

  getValue (section: keyof CubbiesBook, propertyName: keyof CubbiesBookSection) {
    const sectionRecord = this.record.book[section]
    if (typeof sectionRecord === 'object') {
      return typeof sectionRecord[propertyName] === 'string'
    }
    return false
  }

  getLongDate (date: string) {
    return format(parse(date, 'MM/dd/yyyy', new Date()), 'MMM do')
  }

  async setProp (section: keyof CubbiesBook, propertyName: keyof CubbiesBookSection) {
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
.cubbies-book-full-details {
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
