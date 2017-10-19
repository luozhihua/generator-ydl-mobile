<template>
  <div @click="show" class="js-product-selector">
    <slot></slot>
  </div>
</template>

<script>
  import QS from '../../utils/querystring'
  import Backbutton from '../../utils/backbutton'

  class ProductSelector {
    constructor() {
      console.error('ProductSelector is coming soon!')
    }
  }

  export default {

    NAME: 'ProductContract',

    data() {
      return {
        selector: null
      }
    },

    props: {
      autoOpen: {type: Boolean, default: false},
      options: {type: Object},
      onChange: {type: Function},
      title: {type: String, default: '选择产品'}
    },

    mounted() {
      if (this.autoOpen) {
        this.show()
      }
    },

    methods: {
      show() {
        let url = `${this.options.url}?${QS.stringify(this.options.params||{})}`

        this.$store.commit('hideNav')
        this.$selector = new ProductSelector({
          url: url,
          ...this.options,
          primaryColor: '#3B7CEC',
          title: this.title,
          cache: false,
          transfer(data) {
            let result = []

            data = data || []
            data.forEach(prod => {
              result.push({
                'ORIGIN': prod,
                'id': prod.id,
                'name': prod.cpProductName,
                'type': 1,
                'parentId': 0,
                'companyId': prod.cpCompanyId,
                'tenantId': 25,
                'productId': prod.cpProductId,
                'createdId': prod.cpCreatedId,
                'createdTime': prod.cpCreatedTime,
                'modifiedId': prod.cpModifiedId,
                'modifiedTime': prod.cpModifiedTime,
                'status': 0,
                'product': {
                  'id': prod.cpProductId,
                  'managerId': prod.cpManagerId,
                  'price': 2000.0,
                  'unit': '部',
                  'code': prod.productCode,
                  'description': '',
                  'hasPic': 0,
                  'provider': '',
                  'hasDoc': 0,
                  'imgPath': null,
                  'imgId': null,
                  'level1Price': null,
                  'level2Price': null,
                  'level3Price': null,
                  'managerCode': null,
                  'managerName': null,
                  'docPaths': null
                },
                'catalogName': null,
                'managerId': prod.cpManagerId,
                'managerName': null,
                'managerCode': null,
                'fullName': prod.cpProductName
              })
            })

            return result
          }
        })

        // 如果显示则阻止页面后退键
        Backbutton.prevent(() => {
          this.$selector.destroy()
          this.$store.commit('showNav')
        })
        this.$store.commit('hideNav')

        this.$selector.on({
          open: () => {
            this.$emit('open')
          },

          'cancel': () => {
            Backbutton.remove()
            this.$store.commit('showNav')
          },

          'selected': results => {
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
