<script>
  export default {
    NAME: 'ButtonBase',

    props: {
      tag: {type: String, default: 'button'},
      className: {type: String},
      theme: {type: String, default: 'default'},
      size: {type: String, default: 'normal'}
    },

    methods: {
      clickHandle: function (event) {
        this.$emit('click')
      }
    },

    computed: {
      computedClassName: function () {
        return ['js-button'].concat(this.className).concat(this.theme).concat(this.size)
      }
    },

    render: function (h) {
      return h(this.tag, {
        class: this.computedClassName,
        theme: this.theme,
        on: {
          click: this.clickHandle
        }
      }, this.$slots.default)
    }
  }
</script>

<style lang="less">
  .js-button {
    display: inline-block;
    background-color: #fff;
    border: 0;
    border-radius: .5rem;
    transition: .2s;

    &.default {
      background-color: #fff;
      color: #666;
    }
    &.success {
      background-color: #50BAA1;
      color: #fff;
    }
    &.info {
      background-color: #00a8ff;
      color: #fff;
    }
    &.primary {
      background-color: #3651A2;
      color: #fff;
    }
    &.disabled, &[disabled] {
      background-color: #8c9394;
      color: #fff;
    }
    &.warnnig {
      background-color: #b68205;
      color: #fff;
    }
    &.error {
      background-color: #b63333;
      color: #fff;
    }

    &.tiny {
      padding: .4rem;
      font-size: .9rem;
    }
    &.small {
      padding: .4rem .8rem;
      font-size: 1rem;
    }
    &.normal {
      padding: .8rem 1.1rem;
      font-size: 1.1rem;
    }
    &.large {
      padding: 1.1rem 1.6rem;
      font-size: 1.2rem;
    }
    &.big {
      padding: 1.6rem 2.5rem;
      font-size: 1.4rem;
    }
  }
</style>
