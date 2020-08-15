import { saveAs } from 'file-saver'
import { unparse, UnparseConfig } from 'papaparse'

export const createCSV = (data: any[], name: string, config?: UnparseConfig) => {
  const csv = unparse(data, config)
  const file = new File([csv], name, { type: 'text/csv', lastModified: Date.now() })
  saveAs(file)
}
