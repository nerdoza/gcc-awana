import { grades } from '@/const'

export default function (value: string) {
  return grades.find(v => v.value === value)?.text
}
