import VeeValidate from 'vee-validate'

VeeValidate.Validator.extend('eq', (value, [paramValue]) => {
  return value === paramValue
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.extend('phone', (value) => {
  // eslint-disable-next-line camelcase
  let phone_regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\\./0-9]*$/g
  return phone_regex.test(value)
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.extend('lt_value', (value, [paramValue]) => {
  return Number(value) < Number(paramValue)
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.extend('gt_value', (value, [paramValue]) => {
  return Number(value) > Number(paramValue)
}, { hasTarget: true, computesRequired: true })

VeeValidate.Validator.localize('id')

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.use(VeeValidate)
}
