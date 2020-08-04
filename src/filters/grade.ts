import Vue from 'vue'

import { grades } from '@/const'

function gradeFilter (value: string) {
  return grades.find(v => v.value === value)?.text
}

Vue.filter('grade', gradeFilter)
