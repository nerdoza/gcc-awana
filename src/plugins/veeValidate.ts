import { extend } from 'vee-validate'
import { email, max, required } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: '{_field_} is required'
})

extend('max', {
  ...max,
  message: 'This field must be {length} characters or less'
})

extend('email', {
  ...email,
  message: 'Must be a valid email'
})
