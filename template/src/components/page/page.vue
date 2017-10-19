<template>
  <transition name="page-slide">
    <section :class="computedClass" :style="styles">
      <header v-if="hasHeader" class="js-page-header">
        <slot name="header"></slot>
      </header>

      <div class="js-page-main" :style="$store.state.page.mainStyle" ref="scroller">
        <slot></slot>
      </div>

      <footer v-if="hasFooter" :style="$store.state.page.footerStyle"  class="js-page-footer">
        <slot name="footer" ></slot>
      </footer>
      <slot name="rouji"></slot>
      <sendBox></sendBox>
      <bigImage></bigImage>
    </section>
  </transition>
</template>

<script>
  import BackButton from '../../utils/backbutton'
  import sendBox from '../followRecord/sendBox'
  import bigImage from '../bigImage/bigImage'
  import Form from '../forms/form'

  export default {
    NAME: 'Page',

    mixins: [Form],

    components: {
      sendBox, bigImage
    },
    inheritAttrs: false,
    props: {
      'has-ding-menu': {type: Boolean, default: true},
      'title': {type: String, default: ''},
      'header-bg': {type: String, default: '#50BAA1'},
      'nav-group': {type: String, default: 'crm'},
      'nav-hidden': {type: Boolean, default: true}
    },

    data() {
      return {
        iScrollOptions: {
          preventDefault: true,
          click: true,
          tap: true
        },
        startY: 0
      }
    },

    mounted() {
      if (this.navGroup) {
        this.$store.commit('setActiveNav', this.navGroup)
      }

      // iOS 监听返回按钮
      this.setDingLeft({
        text: '返回',
        onSuccess: () => {
          if (BackButton.handler() !== false) {
            this.back()
          }
        }
      })

      if (this.navHidden === false) {
        this.$store.commit('unlockNav')
        this.$store.commit('showNav')
        this.$store.commit('lockNav')
      } else {
        this.$store.commit('hideNav')
        this.$store.commit('lockNav')
      }

      if (this.hasDingMenu) {
        this.initDingMenus()
      }
      this.setDingTitle(this.title)
      this.initEvent()
    },

    watch: {
      title(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.setDingTitle(newValue)
        }
      }
    },

    computed: {
      computedClass() {
        let clsName = ['js-page']

        if (this.hasHeader) {
          clsName.push('has-header')
        }

        if (this.hasFooter) {
          clsName.push('has-footer')
        }

        if (this.$store.state.frame.navVisible) {
          clsName.push('nav-placehold')
        }

        return clsName
      },

      hasHeader() {
        return !!this.$slots.header
      },

      hasFooter() {
        return !!this.$slots.footer
      },

      styles() {
        return {
          // bottom: this.$store.state.frame.navVisible ? '5rem' : '0'
        }
      }
    },

    methods: {

      initEvent() {
        let scroller = this.$refs.scroller
        let eventOptions

        /**
         * @return {Boolean} [description]
         */
        function isPassive() {
          let supportsPassiveOption = false

          try {
            addEventListener('test', null, Object.defineProperty({}, 'passive', {
              get: function () {
                supportsPassiveOption = true
              }
            }))
          } catch (e) {}
          return supportsPassiveOption
        }

        eventOptions = !isPassive() ? false : {
          capture: false,
          passive: false
        }

        scroller.addEventListener('touchstart', this.touchstart, eventOptions)
        scroller.addEventListener('touchmove', this.touchmove, eventOptions)
      },

      getTouchPoint(event) {
        let toucheEvent = event.touches ? event.touches[0] : event

        return {
          x: toucheEvent.pageX,
          y: toucheEvent.pageY
        }
      },

      touchstart(event) {
        let startPoint = this.getTouchPoint(event)

        this.lastTime = new Date().getTime()
        this.startX = startPoint.x
        this.startY = startPoint.y
      },

      touchmove(event) {
        let point = this.getTouchPoint(event)
        let target = event.currentTarget
        let isIOS = window.navigator.userAgent.match(/(iPhone|iPad)/)
        let {$store} = this
        let {frame} = $store.state
        // let startX = this.lastX || this.startX
        let startY = this.lastY || this.startY
        let isVerticalMoving = this.isVerticalMoving(this.startX, this.startY, point.x, point.y)
        let lastTime = this.lastTime
        let now = new Date().getTime()
        let time = now - lastTime
        let speed = Math.abs(point.y - startY) / (time)
        let respondSpeed = 1
        let shouldToggleNav = isVerticalMoving && speed > respondSpeed

        if (point.y > this.startY) {
          // 向下滑屏
          // console.log('向下滑屏', this.startY, point.y)

          if (isIOS && target.scrollTop === 0) {
            //console.log('到顶了')
            event.preventDefault()
          }

          // 导航隐藏时向下滑屏使其出现
          if (shouldToggleNav && this.navHidden && !frame.navVisible) {
            $store.dispatch('showNav', true)
          }
        } else if (point.y < this.startY) {
          // 向上滑屏
          //console.log('向上滑屏', this.startY, point.y)

          if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            //console.log('到底了')
            isIOS && event.preventDefault()
          }

          // 导航临时显示状态时（navLocked），向上滑屏使其隐藏
          if (shouldToggleNav && frame.navVisible && this.navHidden) {
            $store.commit('hideNav')
          }
        }

        this.lastX = point.x
        this.lastY = point.y
        this.lastTime = now
      },

      isVerticalMoving(startX, startY, x, y) {
        let angle = this.getAngle(startX, startY, x, y)
        let result = false

        if (angle > 315 || angle < 45 || (angle > 135 && angle < 225)) {
          result = true
        }

        return result
      },

      /**
       * 获取手指滑动方向
       */
      getAngle(px, py, mx, my) {
        let x = Math.abs(px - mx)
        let y = Math.abs(py - my)
        let z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
        let cos = y / z
        let radina = Math.acos(cos) //用反三角函数求弧度
        let angle = Math.floor(180 / (Math.PI / radina)) //将弧度转换成角度

        //鼠标在第四象限
        if (mx > px && my > py) {
          angle = 180 - angle;
        }

        //鼠标在y轴负方向上
        if (mx === px && my > py) {
          angle = 180;
        }

        //鼠标在x轴正方向上
        if (mx > px && my === py) {
          angle = 90;
        }

        //鼠标在第三象限
        if (mx < px && my > py) {
          angle = 180 + angle;
        }

        //鼠标在x轴负方向
        if (mx < px && my === py) {
          angle = 270;
        }

        //鼠标在第二象限
        if (mx < px && my < py) {
          angle = 360 - angle;
        }

        return angle;
      }
    }
  }
</script>

<!--局部样式-->
<style lang="less" scoped>

  @headerHeight: 5rem;
  @footerHeight: 5rem;

  .js-page {
    font-family: "PingFang SC", "-apple-system", "BlinkMacSystemFont", "PingFang SC", "Helvetica Neue";

    background-color: #f9f9fa;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    transition: bottom .3s;

    div, span {
      line-height: 1;
    }

    .js-page-header {
      height: @headerHeight;
      position: absolute;
      z-index: 3;
      top: 0;
      left: 0;
      right: 0;

      a {
        color: #fff;
        display: inline-block;
        padding: 8px;
      }
    }

    .js-page-main {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    &.has-header .js-page-main {
      top: @headerHeight;
      height: calc(~"100% - @{headerHeight}");
    }
    &.has-footer .js-page-main {
      bottom: @footerHeight;
      height: calc(~"100% - @{footerHeight}");
    }

    &.has-header.has-footer .js-page-main {
      height: calc(~"100% - @{headerHeight} - @{footerHeight}");
    }

    .js-page-footer {
      transition: .3s;
      position: absolute;
      z-index: 2;
      bottom: 0;
      left: 0;
      right: 0;
      height: @footerHeight;

      .btn-group {
        display: flex;

      }
    }

    &.nav-placehold {
      .js-page-main {
        padding-bottom: 5rem;
      }
      .js-page-footer {
        bottom: 5rem;
      }
    }
  }

  .page-slide-enter-active {
    animation: page-slide-in .30s;
    animation-timing-function: cubic-bezier(.5, 0, .5, 1);
    z-index: 1;
  }

  .page-slide-leave-active {
    animation: page-slide-out .35s;
    animation-timing-function: cubic-bezier(.5, 0, .5, 1);
  }
</style>

<!--全局样式-->
<style lang="less">
  @keyframes page-slide-in {
    0% {
      transform: translate(100%);
    }
    100% {
      transform: translate(0);
    }
  }

  @keyframes page-slide-out {
    0% {
      transform: translate(0);
    }
    100% {
      transform: translate(-100%);
    }
  }

  .js-page {

    .js-page-footer {

      .btn-group {
        display: flex;
        height: 100%;

        button {
          box-shadow: none;
          border-radius: 0;
          display: inline-block;
          flex: 1;
          height: 100%;
          font-size: 1.5rem;
          letter-spacing: .3rem;
          font-weight: 300;
        }

        .mu-flat-button {
          background-color: #C1C1C2;
          color: #fff;

          .mu-flat-button-label {
            font-size: 1.5rem;
          }
        }
      }
    }
  }
</style>
