import { isBefore, isSameDay, parse } from 'date-fns'

import agentOfGrace from '@/assets/images/tntBooks/agents_of_grace.png'
export const tntBookImg = agentOfGrace

export const tntBookSchedule: {[index: string]: (keyof TnTBook)} = {
  '09/16/2020': 'chapter1section1',
  '09/23/2020': 'chapter1section2',
  '09/30/2020': 'chapter1section3',
  '10/07/2020': 'chapter1section4',
  '10/14/2020': 'chapter1section5',
  '10/21/2020': 'chapter2section1',
  '10/28/2020': 'chapter2section2',
  '11/04/2020': 'chapter2section3',
  '11/18/2020': 'chapter2section4',
  '12/02/2020': 'chapter2section5',
  '12/09/2020': 'chapter2section6',
  '12/16/2020': 'chapter2section7',
  '01/13/2021': 'chapter3section1',
  '01/20/2021': 'chapter3section2',
  '01/27/2021': 'chapter3section3',
  '02/03/2021': 'chapter3section4',
  '02/10/2021': 'chapter3section5',
  '02/17/2021': 'chapter3section6',
  '02/24/2021': 'chapter3section7',
  '03/03/2021': 'chapter4section1',
  '03/10/2021': 'chapter4section2',
  '03/17/2021': 'chapter4section3',
  '03/24/2021': 'chapter4section4',
  '04/07/2021': 'chapter4section5',
  '04/14/2021': 'chapter4section6',
  '04/21/2021': 'chapter4section7'
}

export const tntBookDates = Object.keys(tntBookSchedule) as Array<keyof TnTBook>
export const tntBookSections = tntBookDates.map(key => tntBookSchedule[key])

export const tntSkipReview = [
  'chapter1section1',
  'chapter2section1',
  'chapter3section1',
  'chapter4section1'
]

export const tntSectionProperties = ['start', 'explore', 'memorize', 'review', 'silver', 'gold']

export const tntKeyForDate = (date: Date) => {
  return tntBookDates.find(key => {
    const keyDate = parse(key, 'MM/dd/yyyy', new Date())
    return isSameDay(keyDate, date) || isBefore(date, keyDate)
  }) ?? '09/16/2020'
}

export const tntSectionLabel = (section: string) => {
  const match = section.match(/^chapter(\d)section(\d)/)
  if (match !== null) {
    return 'Chapter&nbsp;' + match[1] + ' Section&nbsp;' + match[2]
  }
  return ''
}

export const tntTotalSections = Object.keys(tntBookSchedule).length

export const tntSectionSkipReview = (sectionName: keyof TnTBook) => {
  return tntSkipReview.includes(sectionName)
}

export const tntSectionsCompleted = (book: TnTBook) => {
  let totalCompleted = 0

  Object.keys(book).forEach(key => {
    const sectionName = key as keyof TnTBook
    const section = book[sectionName]
    if (typeof section === 'object' && tntSectionCompleted(sectionName, section)) {
      totalCompleted++
    }
  })

  return totalCompleted
}

export const tntSilversCompleted = (book: TnTBook) => {
  let totalCompleted = 0

  Object.keys(book).forEach(key => {
    const sectionName = key as keyof TnTBook
    const section = book[sectionName]
    if (typeof section === 'object' && typeof section.silver === 'string') {
      totalCompleted++
    }
  })

  return totalCompleted
}

export const tntGoldsCompleted = (book: TnTBook) => {
  let totalCompleted = 0

  Object.keys(book).forEach(key => {
    const sectionName = key as keyof TnTBook
    const section = book[sectionName]
    if (typeof section === 'object' && typeof section.gold === 'string') {
      totalCompleted++
    }
  })

  return totalCompleted
}

export const tntSectionCompleted = (sectionName: keyof TnTBook, section: TnTBookSection) => {
  const skipReview = tntSectionSkipReview(sectionName)
  return typeof section.start === 'string' && typeof section.explore === 'string' && typeof section.memorize === 'string' && (skipReview || typeof section.review === 'string')
}

export const tntPropertyIcon = (propertName: keyof TnTBookSection) => {
  switch (propertName) {
    case 'start':
      return '$marker'
    case 'explore':
      return '$search'
    case 'memorize':
      return '$heart'
    case 'review':
      return '$review'
    case 'silver':
      return '$star'
    case 'gold':
      return '$star'
  }
}

export const tntPropertyColor = (propertName: keyof TnTBookSection, alt: boolean = false) => {
  if (!alt) {
    switch (propertName) {
      case 'start':
        return 'orange'
      case 'explore':
        return 'light-blue darken-2'
      case 'memorize':
        return 'red darken-4'
      case 'review':
        return 'light-green darken-2'
      case 'silver':
        return 'grey lighten-1'
      case 'gold':
        return 'amber'
    }
  }
  switch (propertName) {
    case 'start':
      return 'orange lighten-3'
    case 'explore':
      return 'light-blue lighten-3'
    case 'memorize':
      return 'red lighten-3'
    case 'review':
      return 'light-green lighten-3'
    case 'silver':
      return 'grey lighten-1'
    case 'gold':
      return 'amber lighten-3'
  }
}
