<template>
  <i :class="iconClass" :style="styles"></i>
</template>

<script>
  export default {
    NAME: 'Icon',

    props: {
      name: {
        type: String,
        default: 'yd-circle'
      },
      size: {
        type: [String, Number],
        default: '1.6rem'
      },
      color: {
        type: String,
        default: '#000'
      },
      break: {
        type: Boolean,
        default: true
      },
      block: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      iconClass: function () {
        let className = ['yd-icon']
        let name = this.name || ''

        name = name.match(/^yd\-/) ? name : `yd-${name}`

        className.push(name)

        return className
      },

      styles: function () {
        return {
          'display': (this.break || this.block) ? 'block' : 'inline-block',
          'font-size': this.size,
          'color': this.color
        }
      }
    }
  }
</script>
