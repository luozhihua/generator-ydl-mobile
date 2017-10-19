<template>
  <span :class="cssClass">{{ formatter(tweeningValue) }}</span>
</template>

<script>
  import TWEEN from 'tween'
  import moment from 'moment'

  export default {
    NAME: 'Number',
    ALIAS: 'AnimateNumber',

    filters: {
      formatter: function (a) {
        return a
      }
    },

    props: {
      value: {type: [Number, String]},
      type: {type: String, default: 'float'},
      unit: {type: String, default: ''},
      symbol: {type: String, default: ''},
      animate: {type: Boolean, default: false}
    },
    data: function () {
      return {
        filter: 'formatter',
        tweeningValue: 0,
        float: 0
      }
    },
    watch: {
      value: function (newValue, oldValue) {
        this.float = newValue - Math.floor(newValue)

        this.setValue(newValue, oldValue)
      }
    },
    mounted: function () {
      this.setValue(this.value)
    },
    computed: {
      cssClass() {
        return ['animate-number']
      }
    },
    methods: {

      /**
       * 字符格式化
       *
       * @param {Number} value
       * @return {String}
       */
      formatter(value) {
        let regexp = /^([￥$€฿￠])?:?(\w+):?(.+)?$/
        let [
          result = '',
          symbol = this.symbol,
          type = 'float',
          format
        ] = this.type.match(regexp) || []

        symbol = symbol || this.symbol || ''

        switch (type) {
          case 'date':
          case 'time':
          case 'datetime':
          case 'timestamp':
            result = moment(value).format(format)
            break

          case 'currency':
          case 'money':
            value = isNaN(value) ? 0 : value
            result = this.toThousands(parseFloat(value).toFixed(format))
            break

          case 'number':
          case 'float':
          case 'init':
          default:
            format = format || 0
            result = parseFloat(value).toFixed(format)
            result = isNaN(result) ? 0 : result
            break
        }

        return symbol + result + this.unit
      },

      /**
       * 千位分隔符
       *
       * @param num
       * @return {string}
       */
      toThousands(num) {
        let number = (num || 0).toString()
        let parts = number.split('.')
        let initPart = parts[0]
        let floatPart = parts[1] || ''
        let result = ''

        while (initPart.length > 3) {
          result = ',' + initPart.slice(-3) + result
          initPart = initPart.slice(0, initPart.length - 3)
        }

        if (initPart) { result = initPart + result }

        return result + (floatPart ? '.' : '') + floatPart;
      },

      setValue(value, oldValue = 0) {
        if (this.animate) {
          this.tween(oldValue, value)
        } else {
          this.tweeningValue = value
        }
      },

      tween(startValue, endValue) {
        let vm = this

        function animate(time) {
          requestAnimationFrame(animate)
          TWEEN.update(time)
        }

        new TWEEN.Tween({tweeningValue: startValue})
          .to({tweeningValue: endValue}, 500)
          .onUpdate(function () {
            let val = Math.floor(this.tweeningValue) + (this.float || 0)

            vm.tweeningValue = isNaN(val) ? 0 : val
          })
          .start()

        animate()
      }
    }
  }
</script>

<style lang="less" scoped="">
  .animate-number,
  .number {
    font-family: Roboto;
    letter-spacing: 0;
  }
</style>
