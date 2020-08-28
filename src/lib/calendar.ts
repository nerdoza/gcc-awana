import { add, differenceInDays, format, isBefore, isFuture, isSameDay, parse } from 'date-fns'

const calendarUniqueDates: {[index: string]: {title: string, noClub?: true}} = {
  '09/09/2020': { title: 'Drive-Thru Book Pick-Up' },
  '11/25/2020': { title: 'Thanksgiving Break', noClub: true },
  '12/23/2020': { title: 'Christmas Break', noClub: true },
  '12/30/2020': { title: 'Christmas Break', noClub: true },
  '01/06/2021': { title: 'Christmas Break', noClub: true },
  '03/31/2021': { title: 'Easter Break', noClub: true },
  '05/12/2021': { title: 'Award Night' }
}

export const months = ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May']
export const startDate = parse('09/09/2020', 'MM/dd/yyyy', new Date())
export const endDate = parse('5/12/2021', 'MM/dd/yyyy', new Date())

export const getDates = () => {
  const months: {[index: string]: Array<{date: Date, day: string, title: string, noClub?: true}>} = { September: [], October: [], November: [], December: [], January: [], February: [], March: [], April: [], May: [] }
  for (let date = startDate; isBefore(date, add(endDate, { weeks: 1 })); date = add(date, { weeks: 1 })) {
    const formattedDate = format(date, 'MM/dd/yyyy')
    const day = format(date, 'd')
    const month = format(date, 'MMMM')
    let dayRecord = { date, day, title: '' }
    if (typeof calendarUniqueDates[formattedDate] !== 'undefined') {
      dayRecord = { ...dayRecord, ...calendarUniqueDates[formattedDate] }
    }
    months[month].push(dayRecord)
  }
  return months
}

export const isNextClub = (date: Date) => {
  const today = new Date()
  if (isSameDay(date, startDate) && isFuture(date)) {
    return true
  }
  const diff = differenceInDays(date, today)
  return diff >= 0 && diff < 7
}
