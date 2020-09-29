import decamelize from 'decamelize'

import sparksHangGlider from '@/assets/images/sparksBooks/hang_glider.png'
import sparksSkyStormer from '@/assets/images/sparksBooks/sky_stormer.png'
import sparksWingRunner from '@/assets/images/sparksBooks/wing_runner.png'

export const sparksBookRequirements: {[index: string]: number} = {
  flight: 4,
  rankTest: 8,
  redJewel1: 4,
  greenJewel1: 4,
  redJewel2: 4,
  greenJewel2: 4,
  redJewel3: 4,
  greenJewel3: 4,
  redJewel4: 4,
  greenJewel4: 4,
  rankTestReview: 8,
  redJewel1Review: 4,
  greenJewel1Review: 4,
  redJewel2Review: 4,
  greenJewel2Review: 4,
  redJewel3Review: 4,
  greenJewel3Review: 4,
  redJewel4Review: 4,
  greenJewel4Review: 4
}

export const sparksTotalSegmentsRequirementsPerPass = 40

export const sparksSegmentsRequired = (book: SparksBook) => {
  return book.skipFlight !== true ? sparksTotalSegmentsRequirementsPerPass + 4 : sparksTotalSegmentsRequirementsPerPass
}

export const sparksBookSectionOrder: Array<keyof SparksBook> = [
  'rankTest',
  'redJewel1',
  'greenJewel1',
  'redJewel2',
  'greenJewel2',
  'redJewel3',
  'greenJewel3',
  'redJewel4',
  'greenJewel4',
  'rankTestReview',
  'redJewel1Review',
  'greenJewel1Review',
  'redJewel2Review',
  'greenJewel2Review',
  'redJewel3Review',
  'greenJewel3Review',
  'redJewel4Review',
  'greenJewel4Review'
]

export const sparksCompletedInSection = (section: SparksSectionFour | SparksSectionEight | undefined) => {
  if (typeof section === 'undefined') {
    return 0
  }
  return Object.keys(section).length
}

export const sparksFocusSection: (book: SparksBook) => keyof SparksBook = (book: SparksBook) => {
  if ((typeof book.skipFlight === 'undefined' || !book.skipFlight) && sparksCompletedInSection(book.flight) !== sparksBookRequirements.flight) {
    return 'flight'
  }

  let focusSection = sparksBookSectionOrder.find(section => {
    const bookSection = book[section]
    if (typeof bookSection !== 'object') {
      return true
    }

    const requiredLength = sparksBookRequirements[section]
    if (requiredLength === 8) {
      return !(Object.keys(bookSection).length === 8)
    } else {
      return !((Object.keys(bookSection).length >= (requiredLength - 1)) && typeof bookSection.s4 === 'string')
    }
  })

  if (typeof focusSection === 'undefined') {
    focusSection = 'completed'
  }

  return focusSection
}

export const sparksSectionIsComplete = (sectionRecord: SparksSectionFour | SparksSectionEight | undefined, section: keyof SparksBook) => {
  if (typeof sectionRecord === 'object') {
    return sparksCompletedInSection(sectionRecord) === sparksBookRequirements[section]
  }
  return false
}

export const sparksSegmentsCompleted = (book: SparksBook) => {
  let totalCompleted = 0

  Object.keys(book).forEach(key => {
    const section = book[key as keyof SparksBook]
    if (typeof section === 'object') {
      totalCompleted += sparksCompletedInSection(section)
    }
  })

  return totalCompleted
}

export const sparksReviewSegmentsCompleted = (book: SparksBook) => {
  let totalCompleted = 0

  Object.keys(book).forEach(key => {
    if (key.includes('Review')) {
      const section = book[key as keyof SparksBook]
      if (typeof section === 'object') {
        totalCompleted += sparksCompletedInSection(section)
      }
    }
  })

  return totalCompleted
}

export const sparksBucksEarned = (book: SparksBook) => {
  return sparksSegmentsCompleted(book)
}

export const sparksSectionLabel = (section: keyof SparksBook) => {
  if (section === 'flight') {
    return 'Flight 3:16'
  }
  return decamelize(section, ' ').split(' ').map(seg => seg[0].toUpperCase() + seg.slice(1)).join(' ')
    .replace(/[^0-9](?=[0-9])/g, '$& #')
    .replace(' Review', '')
}

export const sparksBookImg = (bookNum: number) => {
  if (bookNum === 3) {
    return sparksSkyStormer
  }
  if (bookNum === 2) {
    return sparksWingRunner
  }
  return sparksHangGlider
}
