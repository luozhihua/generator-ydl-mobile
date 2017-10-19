<template>
  <section :class="cssClass">
    <header class="js-panel-header row">
      <div class="col" :class="w_100"><slot name="header-left"></slot></div>
      <div class="col btn-group"><slot name="header-right"></slot></div>
    </header>
    <div class="js-panel-main">
      <slot></slot>
    </div>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </section>
</template>

<script>
  export default {
    NAME: 'Panel',

    props: {
      // [none, top, bottom, left, right, vertical, horizontal]
      border: {type: String, default: 'bottom'},
      w_100: {type: String, default: ''}
    },

    computed: {
      cssClass() {
        return ['js-panel', `border-${this.border}`]
      }
    }
  }
</script>

<style lang="less" scoped="scoped">
  .js-panel {
    .js-panel-header {
      padding: 1.5rem 1.5rem .8rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      .btn-group {
        position: absolute;
        top: 1.2rem;
        right: 1.5rem;
      }
      >.col {
        display: flex;
        align-items: center;
        justify-content: center;

        &:first-child {
          font-family: PingFangSC-Regular;
          font-size: 1.5rem;
          color: #747474;
          letter-spacing: 0;
          font-weight: 500;
        }
      }
    }

    .js-panel-main {
      padding: 0 1.4rem 1.8rem;
    }

    @border: 1rem solid #f5f5f5;
    &.border-top { border-top: @border; }
    &.border-none { border-width: 0; }
    &.border-left { border-left: @border; }
    &.border-vertical, &.y { border-left: @border; border-right: @border; }
    &.border-horizontal, &.x { border-top: @border; border-bottom: @border; }
    &.border-all { border: @border; }
  }
  .number-range-select{
    margin-top:3rem;
  }
  .number-range{
    margin:5rem 1.2rem  0;
  }
</style>
