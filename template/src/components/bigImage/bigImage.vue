<template>
  <div class="comments-bigImage" :class="anmation" @click="hideImg" @touchmove="hideImg"
       :style="{'background-image':'url('+$store.state.bigImage.src+')'}" v-if="$store.state.bigImage.show==true">

  </div>


</template>
<script>
  import Backbutton from '../../utils/backbutton'

  export default {
    NAME: 'bigImage',
    components: {},
    props: {},
    data() {
      return {
        anmation: '',
      }
    },
    watch: {
      '$store.state.bigImage.show'(val) {
        if (val) {
          Backbutton.prevent(()=>{
            this.hideImg()
          })
          this.$store.commit('hideNav');
        } else {
          Backbutton.cancelPrevent()
        }
      }
    },

    created() {

    },
    mounted: function () {

    },
    methods: {
      hideImg() {

        this.$store.commit('setBigImage', {show: false, src: ''});
      }
    },
    computed: {},

    beforeDestroy() {
      this.hideImg()
    },

  }
</script>
<style lang="less" scoped="">

  @keyframes zoomBIg {
    from {
      transform: scale(0);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes zoomSmall {
    from {
      transform: scale(0);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .comments-bigImage {
    animation-duration: .3s;
    animation-timing-function: cubic-bezier(.5, 0, .5, 1);
    animation-name: zoomBIg;
    position: fixed;
    z-index: 9999999;
    width: 100%;
    height: 100%;
    background-color: #000;
    background-position: 50% 50%;
    background-size: contain;
    background-origin: content;
    background-repeat: no-repeat;
    left: 0;
    top: 0;
  }

  .comments-SmallImage {
    animation-name: zoomSmall;
  }

  bbody {
    font-family: hoverTreeFont;
  }
</style>
