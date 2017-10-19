<template>
  <div class="wave-effect">
    <div class="placeholder">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    NAME: 'Wave',

    data() {
      return {}
    },

  }
</script>

<style lang="less" scoped>
  @import '../../styles/vars';

  .wave-effect {
    position: relative;
    width: 100%;
    height: 6rem;
    background-color: rgba(62, 173, 255, 0.5);
    overflow: hidden;
    border-radius: 0;

    .placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      position: relative;
      z-index: 21;
      color: #ccc;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 500vw;
      height: 510vw;
      bottom: 0rem;
      left: 50%;
      background-color: rgba(255, 255, 255, .4);
      border-radius: 45%;
      transform: translate(-50%, -2rem) rotate(0);
      animation: rotate 8s linear infinite;
      z-index: 10;
    }

    &::after {
      border-radius: 47%;
      background-color: rgba(255, 255, 255, .9);
      transform: translate(-50%, -2rem) rotate(0);
      animation: rotate 13s linear -5s infinite;
      z-index: 20;
    }

  }

  @keyframes rotate {
    50% {
      transform: translate(-50%, -2rem) rotate(180deg);
    }
    100% {
      transform: translate(-50%, -2rem) rotate(360deg);
    }
  }
</style>
