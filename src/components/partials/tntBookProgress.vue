<template>
  <v-container class="tnt-book-progress pa-0">
    <v-row>
      <v-col cols="auto" class="pa-2">
        <v-progress-circular
          rotate="-90"
          :size="mediumRadialSize"
          width="8"
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
      <v-col cols="auto" align-self="center" class="pa-2">
        <div>Current Section</div>
        <div class="text-h5" v-html="currentSectionLabel"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-expand-transition>
        <v-col cols="12" v-if="showTip" align="center" class="pt-0">
          <v-chip color="primary" pill>Tap section icons as they are completed</v-chip>
        </v-col>
      </v-expand-transition>
      <v-col
        v-for="(propertyName, index) of tntSectionProperties"
        :key="index"
        cols="auto"
        class="pa-2"
      >
        <v-card
          class="section-props text-center rounded-circle d-flex align-center justify-center"
          :color="getValue(currentSection, propertyName) ? tntPropertyColor(propertyName): 'white'"
          :height="mediumRadialSize"
          :width="mediumRadialSize"
          @click="setProp(propertyName)"
          :disabled="propertyName === 'review' && tntSectionSkipReview(currentSection)"
        >
          <v-icon
            :color="getValue(currentSection, propertyName) ? 'white' : tntPropertyColor(propertyName, true)"
            v-text="tntPropertyIcon(propertyName)"
          ></v-icon>
        </v-card>
      </v-col>
    </v-row>
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
import { tntBookSchedule, tntGoldsCompleted, tntKeyForDate, tntPropertyColor, tntPropertyIcon, tntSectionCompleted, tntSectionLabel, tntSectionProperties, tntSectionsCompleted, tntSectionSkipReview, tntSilversCompleted, tntTotalSections } from '@/lib/tnt'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Ref('celebrate-root') readonly confettiRootComponent!: Vue
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: TnTBook}

  readonly tntTotalSections = tntTotalSections
  readonly tntSectionProperties = tntSectionProperties
  readonly tntSectionSkipReview = tntSectionSkipReview
  readonly tntPropertyIcon = tntPropertyIcon
  readonly tntPropertyColor = tntPropertyColor
  readonly mediumRadialSize = mediumRadialSize

  celebrate = false
  celebrateColor = ''
  celebrateIcon = ''
  showTip = this.sectionsCompleted === 0

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

  get goldCompleted () {
    return tntGoldsCompleted(this.record.book)
  }

  get sectionCompleted () {
    const sectionRecord = this.record.book[this.currentSection]
    if (typeof sectionRecord === 'object') {
      return tntSectionCompleted(this.currentSection, sectionRecord)
    }
    return false
  }

  get skipReview () {
    return tntSectionSkipReview(this.currentSection)
  }

  get checkColor () {
    if (this.getValue(this.currentSection, 'gold')) {
      return this.tntPropertyColor('gold')
    }
    if (this.getValue(this.currentSection, 'silver')) {
      return this.tntPropertyColor('silver')
    }
    return 'primary'
  }

  getValue (section: keyof TnTBook, propertyName: keyof TnTBookSection) {
    const sectionRecord = this.record.book[section]
    if (typeof sectionRecord === 'object') {
      return typeof sectionRecord[propertyName] === 'string'
    }
    return false
  }

  async setProp (propertyName: keyof TnTBookSection) {
    if (this.showTip) {
      this.showTip = false
    }

    const section = this.currentSection
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

  doCelebration (type: 'normal' | 'gold' | 'silver') {
    this.celebrateColor = type === 'normal' ? 'primary' : tntPropertyColor(type)
    this.celebrateIcon = type === 'normal' ? '$award' : '$medal'
    this.celebrate = true
    Vue.nextTick(() => {
      confetti(this.confettiRootComponent.$el as HTMLElement, {
        height: '20px',
        width: '20px'
      })
    })
    setTimeout(() => { this.celebrate = false }, 3000)
  }

  @Watch('sectionsCompleted')
  onSectionsCompletedChange (sectionsCompleted: number, oldSectionsCompleted: number) {
    if (sectionsCompleted > oldSectionsCompleted && sectionsCompleted % 4 === 0) {
      this.doCelebration('normal')
    }
  }

  @Watch('silverCompleted')
  onSilversCompletedChange (sectionsCompleted: number, oldSectionsCompleted: number) {
    if (sectionsCompleted > oldSectionsCompleted && sectionsCompleted % 4 === 0) {
      this.doCelebration('silver')
    }
  }

  @Watch('goldCompleted')
  onGoldsCompletedChange (sectionsCompleted: number, oldSectionsCompleted: number) {
    if (sectionsCompleted > oldSectionsCompleted && sectionsCompleted % 4 === 0) {
      this.doCelebration('gold')
    }
  }
}
</script>

<style lang="scss">
.tnt-book-progress {
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
