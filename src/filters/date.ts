import { format } from 'date-fns'
import Vue from 'vue'

const DEFAULT_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"

function dateFilter (date: undefined | null | Date, formatString?: string, options?: any) {
  if (typeof date === 'undefined' || date === null) {
    return ''
  }
  return format(date, formatString ?? DEFAULT_DATE_FORMAT, options)
}

Vue.filter('date', dateFilter)
