<template>
  <v-container class="tnt-parent-progress pa-0">
    <v-row>
      <v-col cols="auto" class="text-center">
        <v-progress-circular
          :rotate="-90"
          :size="60"
          :width="8"
          :value="percentageCompleted"
          color="primary"
        >
          <v-fab-transition leave-absolute>
            <v-icon v-if="sectionCompleted" :color="checkColor">$check</v-icon>
          </v-fab-transition>
          <v-fab-transition leave-absolute>
            <span v-if="!sectionCompleted">{{sectionsCompleted}}/{{tntTotalSections}}</span>
          </v-fab-transition>
        </v-progress-circular>
      </v-col>
      <v-col cols="auto">
        <div>Current Section</div>
        <div class="text-h5">
          <v-icon v-if="allCompleted" color="yellow darken-3" size="30">$award</v-icon>
          <span v-html="currentSectionLabel"></span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-expand-transition>
        <v-col cols="12" v-if="showTip" align="center" class="pt-0">
          <v-chip color="primary" pill>Tap section icons as they are completed</v-chip>
        </v-col>
      </v-expand-transition>
      <v-col
        v-for="(value, propertyName) in sectionState"
        :key="propertyName"
        cols="auto"
        class="pa-2"
      >
        <v-card
          class="section-props text-center rounded-circle d-flex align-center justify-center"
          :color="!value ? 'white' : getPropColor(propertyName)"
          height="60"
          width="60"
          @click="setProp(propertyName, !value)"
          :disabled="propertyName === 'review' && skipReview"
        >
          <v-icon
            :color="value ? 'white' : getPropColor(propertyName)"
            v-text="getPropIcon(propertyName)"
          ></v-icon>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay :value="celebrate" ref="celebrate-root">
      <v-card color="white" class="rounded-circle pa-6 align-center justify-center">
        <v-icon size="90" class="fa-fw" color="primary">$award</v-icon>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { confetti } from 'dom-confetti'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import { now } from '@/const'
import { tntBookSchedule, tntKeyForDate, tntPropertyColor, tntPropertyIcon, tntSectionLabel, tntSectionsCompleted, tntSectionSkipReview, tntSkipReview, tntTotalSections } from '@/lib/tnt'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Ref('celebrate-root') readonly confettiRootComponent!: Vue
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: TnTBook}

  readonly tntTotalSections = tntTotalSections

  celebrate = false
  showTip = this.currentSection === 'chapter1section1' && typeof this.record.book.chapter1section1?.start === 'undefined'
  sectionState = {
    start: false,
    explore: false,
    memorize: false,
    review: false,
    silver: false,
    gold: false
  }

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

  get sectionCompleted () {
    return this.sectionState.start && this.sectionState.explore && this.sectionState.memorize && (this.skipReview || this.sectionState.review)
  }

  get allCompleted () {
    return this.sectionsCompleted === tntTotalSections
  }

  get skipReview () {
    return tntSectionSkipReview(this.currentSection)
  }

  get checkColor () {
    if (this.sectionState.gold) {
      return 'amber'
    }
    if (this.sectionState.silver) {
      return 'grey lighten-1'
    }
    return 'primary'
  }

  getPropIcon (propertyName: keyof TnTBookSection) {
    return tntPropertyIcon(propertyName)
  }

  getPropColor (propertyName: keyof TnTBookSection) {
    return tntPropertyColor(propertyName)
  }

  async setProp (propertyName: keyof TnTBookSection, value: boolean) {
    if (this.showTip) {
      this.showTip = false
    }

    const currentSection = this.currentSection
    let currentSectionRecord = this.record.book[currentSection]

    if (typeof currentSectionRecord === 'object') {
      currentSectionRecord = { ...currentSectionRecord }
      if (value) {
        currentSectionRecord[propertyName] = now()
      } else {
        const { [propertyName]: _, ...currentSectionRecordMod } = currentSectionRecord
        currentSectionRecord = currentSectionRecordMod
      }
    } else {
      if (value) {
        currentSectionRecord = { [propertyName]: now() }
      } else {
        currentSectionRecord = {}
      }
    }

    const updatedBookRecord = { ...this.record.book, [currentSection]: currentSectionRecord }
    await vxm.clubbers.updateClubberBook({ cid: this.record.cid, book: updatedBookRecord })
  }

  @Watch('record.book', { deep: true, immediate: true })
  onBookChange (book: TnTBook) {
    const sectionState = book[this.currentSection]
    if (typeof sectionState === 'object') {
      Object.keys(this.sectionState).forEach(key => {
        Vue.set(this.sectionState, key, typeof sectionState[key as keyof TnTBookSection] === 'string')
      })
    }
  }
}
</script>

<style lang="scss">
.tnt-parent-progress {
  .section-props {
    &.v-card--link:focus:before {
      opacity: 0;
    }

    &.v-card--disabled {
      background-color: #e0e0e0 !important;

      .v-icon {
        color: #424242 !important;
      }
    }
  }
}
</style>
