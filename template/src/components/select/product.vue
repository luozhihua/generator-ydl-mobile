<template>
  <div @click="show" class="js-product-selector">
    <slot></slot>
  </div>
</template>

<script>
  import Backbutton from '../../utils/backbutton'

  class ProductSelector {
    constructor() {
      console.error('ProductSelector is coming soon!')
    }
  }

  export default {

    NAME: 'ProductSelector',

    data() {
      return {
        selector: null
      }
    },

    props: {
      autoOpen: {type: Boolean, default: false},
      options: {type: Object},
      onChange: {type: Function},
      title: {type: [String, Boolean], default: '选择产品'},
      multipe: {type: Boolean, default: true}
    },

    mounted() {
      if (this.autoOpen) {
        this.show()
      }
    },

    methods: {
      show() {

        this.$store.commit('hideNav')
        this.$selector = new ProductSelector({
          ...this.options,
          primaryColor: '#3B7CEC',
          title: this.title,
          multipe: this.multipe
        })

        //console.log(this.$store)
				//console.log(this.$selector)
        // 如果显示则阻止页面后退键
        Backbutton.prevent(() => {
          this.$selector.cancel()
          this.$store.commit('showNav')
        })
        this.$store.commit('hideNav')
        this.$selector.on({
          open: ()=> {
            this.$emit('open')
          },

          cancel: () => {
            Backbutton.remove()
            this.$emit('cancel')
            this.$store.commit('showNav')
          },

          selected: (results) => {

            Backbutton.remove()
            this.$store.commit('showNav')
            this.$emit('input', results)

            if (this.onChange) {
              this.onChange(results)
            }
          }
        })
      }
    },

    beforeDestroy() {
      // this.$selector.destroy()
      delete this.$selector
    }
  }
</script>

