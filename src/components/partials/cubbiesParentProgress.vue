<template>
  <v-container class="cubbies-parent-progress pa-0">
    <v-row>
      <v-col cols="auto" class="pa-2">
        <v-progress-circular
          :rotate="-90"
          :size="mediumRadialSize"
          :width="8"
          :value="percentageCompleted"
          color="primary"
        >
          <v-fab-transition leave-absolute>
            <v-icon v-if="currentSectionsCompleted" color="primary">$check</v-icon>
          </v-fab-transition>
          <v-fab-transition leave-absolute>
            <span v-if="!currentSectionsCompleted">{{sectionsCompleted}}/{{cubbiesTotalSections}}</span>
          </v-fab-transition>
        </v-progress-circular>
      </v-col>
      <v-col cols="auto" align-self="center" class="pa-2">
        <div>Current Section{{ currentSections.length > 1 ? 's' : ''}}</div>
        <div class="text-h5" v-html="currentSectionsLabel"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-expand-transition>
        <v-col cols="12" v-if="showTip" align="center" class="pt-0">
          <v-chip color="primary" pill>Tap section icons as they are completed</v-chip>
        </v-col>
      </v-expand-transition>
      <template v-for="(section, secIndex) of currentSections">
        <v-divider vertical v-if="secIndex === 1" :key="secIndex"></v-divider>
        <template v-for="propertyName of cubbiesSectionProperties">
          <v-col :key="secIndex + propertyName" cols="auto" class="pa-2">
            <v-card
              class="section-props text-center rounded-circle d-flex align-center justify-center"
              :color="getValue(section, propertyName) ? cubbiesSectionColor(section): 'white'"
              :height="mediumRadialSize"
              :width="mediumRadialSize"
              @click="setProp(section, propertyName)"
              :disabled="propertyName === 'review' && cubbiesSectionSkipReview(section)"
            >
              <v-icon
                :color="getValue(section, propertyName) ? 'white' : cubbiesSectionColor(section, true)"
                v-text="cubbiesPropertyIcon(propertyName)"
              ></v-icon>
            </v-card>
          </v-col>
        </template>
      </template>
    </v-row>
    <v-overlay :value="celebrate" ref="celebrate-root">
      <v-card color="white" class="rounded-circle pa-6 align-center justify-center">
        <v-icon size="90" class="fa-fw" :color="celebrateColor">$apple</v-icon>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { confetti } from 'dom-confetti'
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

import { mediumRadialSize, now } from '@/const'
import { cubbiesAwards, cubbiesBookSchedule, cubbiesKeyForDate, cubbiesPropertyIcon, cubbiesSectionColor, cubbiesSectionCompleted, cubbiesSectionProperties, cubbiesSectionsCompleted, cubbiesSectionSkipReview, cubbiesSectionsLabel, cubbiesTotalSections } from '@/lib/cubbies'
import { vxm } from '@/store'

@Component
export default class extends Vue {
  @Ref('celebrate-root') readonly confettiRootComponent!: Vue
  @Prop() readonly record!: { cid: string, clubber: Clubber, book: CubbiesBook}

  readonly cubbiesTotalSections = cubbiesTotalSections
  readonly cubbiesSectionProperties = cubbiesSectionProperties
  readonly cubbiesSectionSkipReview = cubbiesSectionSkipReview
  readonly cubbiesPropertyIcon = cubbiesPropertyIcon
  readonly cubbiesSectionColor = cubbiesSectionColor
  readonly mediumRadialSize = mediumRadialSize

  celebrate = false
  celebrateColor = ''
  showTip = this.sectionsCompleted === 0

  get sectionsCompleted () {
    return cubbiesSectionsCompleted(this.record.book)
  }

  get percentageCompleted () {
    return Math.round((this.sectionsCompleted / cubbiesTotalSections) * 100)
  }

  get currentKey () {
    return cubbiesKeyForDate(new Date())
  }

  get currentSections () {
    return cubbiesBookSchedule[this.currentKey]
  }

  get currentSectionsLabel () {
    return cubbiesSectionsLabel(this.currentSections)
  }

  get currentSectionsCompleted () {
    return this.currentSections.every(section => {
      const sectionRecord = this.record.book[section]
      if (typeof sectionRecord === 'object') {
        return cubbiesSectionCompleted(section, sectionRecord)
      }
    })
  }

  get totalAwards () {
    return cubbiesAwards(this.record.book)
  }

  getValue (section: keyof CubbiesBook, propertyName: keyof CubbiesBookSection) {
    const sectionRecord = this.record.book[section]
    if (typeof sectionRecord === 'object') {
      return typeof sectionRecord[propertyName] === 'string'
    }
    return false
  }

  async setProp (section: keyof CubbiesBook, propertyName: keyof CubbiesBookSection) {
    if (this.showTip) {
      this.showTip = false
    }

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

  doCelebration () {
    this.celebrateColor = cubbiesSectionColor(this.currentSections[0])
    this.celebrate = true
    Vue.nextTick(() => {
      confetti(this.confettiRootComponent.$el as HTMLElement, {
        height: '20px',
        width: '20px'
      })
    })
    setTimeout(() => { this.celebrate = false }, 3000)
  }

  @Watch('totalAwards')
  onAwardsChange (awards: number, oldAwards: number) {
    if (awards > oldAwards) {
      this.doCelebration()
    }
  }
}
</script>

<style lang="scss">
.cubbies-parent-progress {
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
