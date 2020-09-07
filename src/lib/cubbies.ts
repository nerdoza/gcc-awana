import { isBefore, isSameDay, parse } from 'date-fns'

import honeyComb from '@/assets/images/cubbiesBooks/honey_comb.png'
export const cubbiesBookImg = honeyComb

export const cubbiesBookSchedule: {[index: string]: Array<keyof CubbiesBook>} = {
  '09/09/2020': ['redA'],
  '09/16/2020': ['redB'],
  '09/23/2020': ['red1'],
  '09/30/2020': ['red2'],
  '10/07/2020': ['green3'],
  '10/14/2020': ['green4'],
  '10/21/2020': ['green5', 'green6'],
  '10/28/2020': ['red7'],
  '11/11/2020': ['red8'],
  '11/18/2020': ['sd1'],
  '12/02/2020': ['red9', 'red10'],
  '12/09/2020': ['green11'],
  '12/16/2020': ['sd2'],
  '01/13/2021': ['green12'],
  '01/20/2021': ['green13'],
  '01/27/2021': ['green14'],
  '02/03/2021': ['red15'],
  '02/10/2021': ['red16'],
  '02/17/2021': ['sd3'],
  '02/24/2021': ['red17', 'red18'],
  '03/03/2021': ['green19'],
  '03/10/2021': ['green20'],
  '03/17/2021': ['green21'],
  '03/24/2021': ['sd4'],
  '04/07/2021': ['green22'],
  '04/14/2021': ['red23'],
  '04/21/2021': ['red24'],
  '04/28/2021': ['red25'],
  '05/05/2021': ['red26']
}

export const cubbiesAwardSets: Array<Array<keyof CubbiesBook>> = [
  ['redA', 'redB', 'red1', 'red2'],
  ['green3', 'green4', 'green5', 'green6'],
  ['red7', 'red8', 'red9', 'red10'],
  ['green11', 'green12', 'green13', 'green14'],
  ['red15', 'red16', 'red17', 'red18'],
  ['green19', 'green20', 'green21', 'green22'],
  ['red23', 'red24', 'red25', 'red26']
]

export const cubbiesBookDates = Object.keys(cubbiesBookSchedule) as Array<keyof CubbiesBook>
export const cubbiesBookSections = cubbiesBookDates.reduce((acc, date) => {
  const sectionRecord = cubbiesBookSchedule[date]
  if (typeof sectionRecord === 'object') {
    acc.push(...sectionRecord)
  }
  return acc
}, new Array<keyof CubbiesBook>())

export const cubbiesSkipReview = [
  'sd1', 'sd2', 'sd3', 'sd4'
] as Array<keyof CubbiesBook>

export const cubbiesSectionProperties = ['memorize', 'review']

export const cubbiesKeyForDate = (date: Date) => {
  return cubbiesBookDates.find(key => {
    const keyDate = parse(key, 'MM/dd/yyyy', new Date())
    return isSameDay(keyDate, date) || isBefore(date, keyDate)
  }) ?? '09/09/2020'
}

export const cubbiesSectionLabel = (section: string) => {
  const match = section.match(/^(red|green|sd)(\d{1,2})/)
  if (match !== null) {
    if (match[1] === 'sd') {
      switch (match[2]) {
        case '1':
          return 'Thanksgiving Lesson (SD1)'
        case '2':
          return 'Christmas Lesson (SD2)'
        case '3':
          return 'Valentine\'s Day Lesson (SD3)'
        case '4':
          return 'Easter Lesson (SD4)'
      }
    }
    return (match[1] === 'red' ? 'Red' : 'Green') + ' #' + match[2]
  }
  return ''
}

export const cubbiesSectionsLabel = (sections: string[]) => {
  const match1 = sections[0].match(/^(red|green|sd)(\d{1,2}|A|B)/)
  let label = ''
  if (match1 !== null) {
    if (match1[1] === 'sd') {
      switch (match1[2]) {
        case '1':
          return 'Thanksgiving Lesson (SD1)'
        case '2':
          return 'Christmas Lesson (SD2)'
        case '3':
          return 'Valentine\'s Day Lesson (SD3)'
        case '4':
          return 'Easter Lesson (SD4)'
      }
    }
    label = 'Bear Hug ' + match1[2]
  }

  if (typeof sections[1] === 'string') {
    const match2 = sections[1].match(/^(red|green)(\d{1,2})/)
    if (match2 !== null) {
      label += ' & ' + match2[2]
    }
  }

  return label
}

export const cubbiesTotalSections = Object.keys(cubbiesBookSections).length

export const cubbiesSectionSkipReview = (sectionName: keyof CubbiesBook) => {
  return cubbiesSkipReview.includes(sectionName)
}

export const cubbiesSectionsCompleted = (book: CubbiesBook) => {
  let totalCompleted = 0

  Object.keys(book).forEach(key => {
    const sectionName = key as keyof CubbiesBook
    const section = book[sectionName]
    if (typeof section === 'object' && cubbiesSectionCompleted(sectionName, section)) {
      totalCompleted++
    }
  })

  return totalCompleted
}

export const cubbiesSectionCompleted = (sectionName: keyof CubbiesBook, section: CubbiesBookSection) => {
  // const skipReview = tntSectionSkipReview(sectionName)
  return typeof section.memorize === 'string'
}

export const cubbiesPropertyIcon = (propertName: keyof CubbiesBookSection) => {
  switch (propertName) {
    case 'review':
      return '$review'
    case 'memorize':
      return '$apple'
  }
}

export const cubbiesSectionColor = (sectionName: keyof CubbiesBook, alt = false) => {
  const match = sectionName.match(/^(red|green|sd)/)
  if (match !== null) {
    if (match[1] === 'sd') {
      return !alt ? 'amber' : 'amber lighten-3'
    }
    if (!alt) {
      return match[1] === 'red' ? 'red darken-3' : 'green'
    }
    return match[1] === 'red' ? 'red lighten-3' : 'green lighten-3'
  }
  return 'grey'
}

export const cubbiesAwards = (book: CubbiesBook) => {
  let totalAwards = 0
  cubbiesAwardSets.forEach(awardSet => {
    if (awardSet.every(section => {
      const sectionRecord = book[section]
      return typeof sectionRecord === 'object' && typeof sectionRecord.memorize === 'string'
    })) {
      totalAwards++
    }
  })

  return totalAwards
}
