import Validator from 'async-validator'
import {isArray, isUndefined, isString, isNull, isBoolean, isPlainObject} from 'lodash'

const FORM_RULES = 'formRules'
const ERRORS = {
  maxLength: '超过最大长度$LENGTH$',
  minLength: '长度不得少于$LENGTH$',
  max: '超过允许的最大值$RANGE$',
  min: '不得小于最小值$RANGE$',
  required: '必填项',
  number: '必须为数字',
  mail: '请输入正确的邮箱名',
  email: '请输入正确的邮箱名',
  mobile: '请输入正确的手机号码',
  phone: '请输入正确的手机号码',
  tel: '请输入正确的电话号码',
  date: '日期格式不正确',
  datetime: '时间格式不正确',
  time: '时间格式不正确'
}

/**
 * 获取表单项的 model name
 * @param vnode
 * @return {String}
 */
function getModelName(vnode) {
  let model, prop

  if (vnode.validateConfig && vnode.validateConfig.prop) {
    prop = vnode.validateConfig.prop
  } else {
    model = vnode.data.model
    model = (model ? model.expression : '').split('.')

    prop = model.pop()
  }

  return prop
}

/**
 * 获取表单组件
 * @param component
 * @return {*}
 */
function getForm(component) {
  let form

  while (component) {
    if (component.IS_FORM) {
      form = component
      break
    } else {
      component = component.$parent
    }
  }

  return form
}

/**
 * 从 Views 的 formRules 中读取验证规则
 * @param vnode
 * @return {Array}
 */
function getCustomRules(vnode) {
  let component = vnode.componentInstance
  let modelName = getModelName(vnode)
  let rules

  while (component) {
    if (component[FORM_RULES]) {
      rules = component[FORM_RULES]
      break
    } else {
      component = component.$parent
    }
  }

  return rules ? rules[modelName] : null
}

/**
 * 获取合并后的验证规则
 * 验证规则来自输入框的 attribute、directive值、以及 Views 统一设置的 formRules
 * @param rules
 * @param vnode
 * @return {[null,null,null]}
 */
function getRules(rules, vnode) {
  let component = vnode.componentInstance
  let customRules = getCustomRules(vnode) || []
  let attrRules = []

  rules = rules || []
  rules = isArray(rules) ? rules : [rules]

  if (component.type) {
    switch (component.type) {
      case 'tel':
      case 'telephone':
      case 'mobile':
        if (component.required) {
          attrRules.push({
            message: ERRORS.required,
            required: component.required
          })
        }

        attrRules.push({
          pattern: /^(\+?\d{1,3})?[-\s]?(\d{3,4}[-\s]?)[\-\s\d]{4,11}$/,
          message: ERRORS.tel
        })
        break;

      case 'number':
        attrRules.push({
          pattern: /^\d+$/,
          message: ERRORS.number
        })

        if (component.required) {
          attrRules.push({
            message: ERRORS.required,
            required: component.required
          })
        }

        if (component.min && !isNaN(component.min)) {
          attrRules.push({
            message: ERRORS.min.replace('$RANGE$', component.min),
            min: parseInt(component.min, 10)
          })
        }

        if (component.max && !isNaN(component.max)) {
          attrRules.push({
            message: ERRORS.max.replace('$RANGE$', component.max),
            max: parseInt(component.max, 10)
          })
        }
        break

      case 'email':
        if (component.required) {
          attrRules.push({
            type: 'email',
            message: ERRORS.email,
            required: component.required
          })
        }
        break

      case 'date':
        if (component.required) {
          attrRules.push({
            type: 'date',
            message: ERRORS.date,
            required: component.required
          })
        }
        break

      case 'text':
        if (component.required) {
          attrRules.push({
            message: ERRORS.required,
            required: component.required
          })
        }

        if (component.maxLength && !isNaN(component.maxLength)) {
          attrRules.push({
            message: ERRORS.maxLength.replace('$LENGTH$', component.maxLength),
            max: parseInt(component.maxLength, 10)
          })
        }

        if (component.minLength && !isNaN(component.minLength)) {
          attrRules.push({
            message: ERRORS.minLength.replace('$LENGTH$', component.minLength),
            min: parseInt(component.minLength, 10)
          })
        }
        break
    }
  } else if (component.required) {
    attrRules.push({
      type: 'string',
      message: ERRORS.required,
      required: component.required
    })
  }

  return [
    ...customRules,
    ...attrRules,
    ...rules
  ]
}

/**
 * 验证
 * @param vnode
 * @param rules
 * @return {Promise}
 */
function validate(vnode, rules) {
  const fieldName = getModelName(vnode)
  const component = vnode.componentInstance
  const descriptor = {
    [fieldName]: rules
  }
  const validator = new Validator(descriptor)
  let model = {}
  let value = component.inputValue || component.value

  if (component.type !== 'number') {
    model[fieldName] = (isUndefined(value) || isNull(value) || isBoolean(value)) ? '' : value + ''
  } else if (isArray(value)) {
    model[fieldName] = value
  } else {
    model[fieldName] = (isUndefined(value) || isNull(value)) ? '' : value
  }

  return new Promise((resolve, reject)=>{
    validator.validate(model, { firstFields: true }, errors => {
      if (errors) {
        component.validateState = 'error'
        component.errorText = component.errorMsg = errors[0].message
        reject(errors)
      } else {
        component.validateState = 'success'
        component.errorText = component.errorMsg = ''
        resolve()
      }
      component.$emit('validate', errors)
    })
  })
}

function getValidateConfig(directiveValue, vnode) {
  let config

  if (vnode.validateConfig) {
    config = vnode.validateConfig
  } else {
    config = {}

    if (isBoolean(directiveValue)) {
      config.enable = directiveValue
    } else if (isPlainObject(directiveValue)) {
      Object.assign(config, directiveValue)
    } else if (isUndefined(directiveValue)) {
      config.enable = true
    } else if (isString(directiveValue)) {
      config.enable = true
      config.prop = directiveValue
    }

    vnode.validateConfig = config
  }

  return config
}

/**
 * Vue directive 表单项验证
 */
export default {

  NAME: 'validate',

  bind(el, binding, vnode, oldVnode) {
    const component = vnode.componentInstance
    let config = getValidateConfig(binding.value, vnode)
    let modelName = getModelName(vnode)
    let form = getForm(component)
    let rules = getRules(binding.value, vnode)

    if (config.enable && rules && rules.length > 0) {
      component.validate = () => {
        return validate(vnode, rules)
      }

      component.$on('change', ()=>{
        validate(vnode, rules)
      })

      component.$on('input', ()=>{
        validate(vnode, rules)
      })

      form.addField(modelName, component)
    }
  },

  unbind(el, binding, vnode, oldVnode) {
    const component = vnode.componentInstance
    let form = getForm(component)
    let modelName = getModelName(vnode)

    form.removeField(modelName, component)
    // component.$off('change')
  }
}
