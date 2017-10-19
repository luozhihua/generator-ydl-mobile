<template>
  <form class="form-component" @submie.prevent="submit">
    <slot></slot>
  </form>
</template>

<script>
  export default {
    NAME: 'Form',

    props: {
      rules: {type: [Object, Array] }
    },

    data() {
      return {
        fields: {}
      }
    },

    computed: {

      // readonly
      IS_FORM: {
        get () { return true }
      },

      isValidatedSuccess() {
        let success = true

        this.validate()

        Object.keys(this.fields).forEach((key) => {
          let field = this.fields[key]

          if (field.errorMsg) {
            success = false
          }
        })

        return success
      },

      validateStatus() {
        return this.isValidatedSuccess ? 'success' : 'error'
      }
    },

    methods: {
      validate() {
        let validators = []
        let isFirstFailedInput = true

        Object.keys(this.fields).forEach((key)=>{
          let field = this.fields[key]
          let validator

          validator = field.validate()
          validator.catch(()=>{
            let el = field.$el
            let input, textarea

            if (isFirstFailedInput) {
              input = el.getElementsByTagName('input')
              textarea = el.getElementsByTagName('textarea')
              input = input.length > 0 ? input[0] : textarea[0]

              if (input) {
                this.scrollTo(input).then(()=>{
                  input.focus()
                })
              }
            }

            isFirstFailedInput = false
          })
          validators.push(validator)
        })

        return Promise.all(validators)
      },

      onValidate() {

      },

      addField(fieldName, field) {
        this.fields[fieldName] = field
      },

      removeField(fieldName) {
        delete this.fields[fieldName]
      },

      submit() {

      }
    }
  }
</script>
