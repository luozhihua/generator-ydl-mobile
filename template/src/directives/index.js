import Vue from 'vue'
import validate from './validate'

let directives = [
  validate
]

directives.forEach(directive => {
  let directiveName = directive.directiveName || directive.NAME

  Vue.directive(directiveName, directive)
})
