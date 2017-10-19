<template>
  <form class="validate-component" @submie.prevent="submit">
    <slot></slot>
  </form>
</template>

<script>
  import Validator from 'async-validator'
  import {isArray} from 'lodash'

  const FORM_RULES = 'formRules'
  const ERRORS = {
    maxLength: '超过最大长度$LENGTH$',
    minLength: '长度不得少于$LENGTH$',
    max: '超过允许的最大值$MAX$',
    min: '不得小于最小值$MIN$',
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

  export default {
    NAME: 'Form',

    props: {
      rules: {type: [Object, Array]}
    },

    data() {
      return {
        feilds: {}
      }
    },

    computed: {

      // readonly
      IS_FORM: {
        get() { return true }
      }
    },

    methods: {

      getModelName(vnode) {
        let model = vnode.data.model

        model = (model ? model.expression : '').split('.')

        return model.pop()
      },

      /**
       * 获取表单组件
       * @param component
       * @return {*}
       */
      getForm(component) {
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
      },

      getGlobalRules(vnode) {
        let component = vnode.componentInstance
        let modelName = this.getModelName(vnode)
        let rules

        while (component) {
          if (component[FORM_RULES]) {
            rules = component[FORM_RULES]
            break
          } else {
            component = component.$parent
          }
        }

        return rules[modelName]
      },

      getRules(localRules, vnode, trigger = 'blur') {
        let component = vnode.componentInstance
        let globalRules = this。getGlobalRules(vnode)
        let attrRules = []

        localRules = isArray(localRules) ? localRules : [localRules]

        if (component.type) {
          switch (component.type) {
            case 'number':
              attrRules.push({
                type: component.type,
                message: ERRORS.required,
                required: component.required
              })

              if (component.min) {
                attrRules.push({
                  type: component.type,
                  message: ERRORS.min,
                  min: component.min
                })
              }

              if (component.max) {
                attrRules.push({
                  type: component.type,
                  message: ERRORS.max,
                  max: component.max
                })
              }
              break

            case 'email':
              attrRules.push({
                type: component.type,
                message: ERRORS.required,
                required: component.required
              })

              attrRules.push({
                type: component.type,
                message: ERRORS.email,
                pattern: Validator.pattern.email
              })
              break

            case 'date':
              attrRules.push({
                type: component.type,
                message: ERRORS.date,
                required: component.required
              })
              break

            case 'text':
              attrRules.push({
                type: 'string',
                message: ERRORS.required,
                required: component.required,
                max: component.maxLength || -1,
                min: component.minLength || -1
              })

              if (component.maxLength) {
                attrRules.push({
                  type: component.type,
                  message: ERRORS.maxLength,
                  max: component.maxLength
                })
              }

              if (component.minLength) {
                attrRules.push({
                  type: component.type,
                  message: ERRORS.minLength,
                  min: component.minLength
                })
              }
              break
          }
        }

        return [
          ... globalRules,
          ... attrRules,
          ... localRules
        ]
      },

      validate(vnode, rules) {
        const feildName = getModelName(vnode)
        const component = vnode.componentInstance
        const descriptor = {
          [feildName]: rules
        }
        const validator = new Validator(descriptor)
        let model = {}

        model[feildName] = component.inputValue

        validator.validate(model, {firstFields: true}, errors => {
          debugger
          component.validateState = !errors ? 'success' : 'error'
          component.errorText = errors ? errors[0].message : ''
        })
      }
    }
  }
</script>
