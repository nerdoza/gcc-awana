import camelcase from 'camelcase'
import { saveAs } from 'file-saver'
import { parse, unparse } from 'papaparse'

export const createCSV = (data: any[], name: string) => {
  const csv = unparse(data)
  const file = new File([csv], name, { type: 'text/csv', lastModified: Date.now() })
  saveAs(file)
}

export const parseCSV = async (csvData: string | File) => {
  return await new Promise((resolve, reject) => {
    parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: header => {
        return camelcase(header)
      },
      complete: (result) => {
        if (result.errors.length > 0) {
          result.errors.forEach(e => console.error(e))
        }
        resolve(result.data)
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

export const exportClubberCSV = (records: ClubberRecord[], fileName: string) => {
  const data = records.map(record => ({
    'First Name': record.clubber.firstName,
    'Last Name': record.clubber.lastName,
    Club: record.clubber.club,
    Birthday: record.clubber.birthday,
    Gender: record.clubber.gender,
    Grade: record.clubber.grade,
    'Parent Phone 1': (record.clubber.parents ?? [])[0] ?? '',
    'Parent Phone 2': (record.clubber.parents ?? [])[1] ?? '',
    'Parent Phone 3': (record.clubber.parents ?? [])[2] ?? '',
    'Parent Phone 4': (record.clubber.parents ?? [])[3] ?? ''
  }))

  createCSV(data, fileName)
}
