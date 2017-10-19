<script>
  export default {
    NAME: 'ButtonGroup',

    props: {
      className: {type: String},
      active: 0,
      tag: {type: String, default: 'div'}
    },

    methods: {
      clickHandle: function (event) {
        let list, i

        this.$emit('click')
        if (event.target !== event.currentTarget) {
          list = this.$el.childNodes

          for (i = 0; i < list.length; i++) {
            list[i].classList && list[i].classList.remove('active')
          }

          event.target.classList.add('active')
        }
      }
    },

    render: function (h) {
      return h(this.tag, {
        class: ['js-button-group'],
        on: {
          click: this.clickHandle
        }
      }, this.$slots.default)
    }
  }
</script>

<style lang="less">

  .js-button-group {
    display: flex;

    .js-button {
      border-radius: 0px;
      border: .1rem solid #888;
      padding: .4rem .7rem;
      font-size: 1.1rem;

      &:first-child:last-child {
        border-radius: .4rem;
      }

      &:first-child {
        border-radius: .4rem 0 0 .4rem;
      }
      &:last-child {
        border-radius: 0px .4rem .4rem 0;
      }
      &.default.active {
        box-shadow: inset 0 0 .3rem rgba(0,0,0,0.1);
        background: #888;
        color: #fff;
      }
    }
  }
</style>
