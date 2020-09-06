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

export const getSparksFocusSection: (book: SparksBook) => keyof SparksBook = (book: SparksBook) => {
  if ((typeof book.skipFlight === 'undefined' || !book.skipFlight) && book.flight?.length !== sparksBookRequirements.flight) {
    return 'flight'
  }

  let newSection: keyof SparksBook | undefined
  sparksBookSectionOrder.forEach(section => {
    const bookSection = book[section]
    if (typeof newSection === 'undefined' && (typeof bookSection === 'undefined' || (Array.isArray(bookSection) && bookSection.length !== sparksBookRequirements[section]))) {
      newSection = section
    }
  })

  if (typeof newSection === 'undefined') {
    newSection = 'completed'
  }

  return newSection
}

export const getSparksSegmentsRequired = (book: SparksBook) => {
  return book.skipFlight !== true ? sparksTotalSegmentsRequirementsPerPass + 4 : sparksTotalSegmentsRequirementsPerPass
}

export const getSparksSegmentsCompleted = (book: SparksBook) => {
  let totalCompleted = 0

  Object.keys(book).forEach(key => {
    const section = book[key as keyof SparksBook]
    if (typeof section === 'object') {
      totalCompleted += section.length
    }
  })

  return totalCompleted
}

export const getSparksSectionLabel = (section: keyof SparksBook) => {
  if (section === 'flight') {
    return 'Flight 3:16'
  }
  return decamelize(section, ' ').split(' ').map(seg => seg[0].toUpperCase() + seg.slice(1)).join(' ')
    .replace(/[^0-9](?=[0-9])/g, '$& #')
    .replace(' Review', '')
}

export const getSparksBookImg = (bookNum: number) => {
  if (bookNum === 3) {
    return sparksSkyStormer
  }
  if (bookNum === 2) {
    return sparksWingRunner
  }
  return sparksHangGlider
}
