declare module 'element-ui';

declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}

declare module "*.html" {
  // const content: string
  // export default content

  import Vue = require('vue')
  interface Template {
    <V extends Vue>(options: Vue.ComponentOptions<V>): Vue.ComponentOptions<V>
    <V extends typeof Vue>(component: V): V
  }
  const template: Template
  export default template
}

declare module "*.svg" {
  const value: {
    viewBox: string
    id: string
    content: string
  }
  export default value
}
