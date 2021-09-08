import { add, differenceInDays, format, isBefore, isFuture, isSameDay, parse } from 'date-fns'

const calendarUniqueDates: {[index: string]: {title?: string, noClub?: true, subText?: string}} = {
  '09/08/2021': { title: 'Opening Night' },
  '09/29/2021': { title: 'Crazy Night', subText: 'Team Color' },
  '10/06/2021': { subText: 'Bring a friend to T&T' },
  '10/20/2021': { title: 'Family BBQ @ 5pm', subText: 'Regular Club @ 6pm' },
  '10/27/2021': { title: 'Crazy Night', subText: 'Hat Night' },
  '11/10/2021': { title: 'Veterans Day Break', noClub: true },
  '11/17/2021': { title: 'Crazy Night', subText: 'Glow in the Dark' },
  '11/24/2021': { title: 'Thanksgiving Break', noClub: true },
  '12/15/2021': { title: 'Crazy Night', subText: 'Christmas Night' },
  '12/22/2021': { title: 'Christmas Break', noClub: true },
  '12/29/2021': { title: 'Christmas Break', noClub: true },
  '01/05/2022': { title: 'Christmas Break', noClub: true },
  '01/26/2022': { title: 'Crazy Night', subText: 'Tropical Island' },
  '02/02/2022': { subText: 'Sock Drive' },
  '02/09/2022': { subText: 'Sock Drive' },
  '02/16/2022': { subText: 'Sock Drive' },
  '02/23/2022': { title: 'Crazy Night', subText: 'Mismatch Night' },
  '03/16/2022': { title: 'Grand Prix', subText: 'Check-In: Mar 15 @ 6pm' },
  '03/23/2022': { title: 'Crazy Night', subText: 'Sport/Rock Star Night' },
  '04/13/2022': { title: 'Easter Break', noClub: true },
  '04/27/2022': { title: 'Crazy Night', subText: 'Crazy Hair' },
  '05/11/2022': { title: 'Award Night', subText: 'BBQ @ 5pm' }
}

export const months = ['September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May']
export const startDate = parse('09/08/2021', 'MM/dd/yyyy', new Date())
export const endDate = parse('5/11/2022', 'MM/dd/yyyy', new Date())

export const getDates = () => {
  const months: {[index: string]: Array<{date: Date, day: string, title?: string, noClub?: true, subText?: string}>} = { September: [], October: [], November: [], December: [], January: [], February: [], March: [], April: [], May: [] }
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
