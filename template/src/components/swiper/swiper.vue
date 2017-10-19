<template>
  <section class="cssClass">
    <div class="swiper-container swiper-container-horizontal swiper-container-3d swiper-container-coverflow">
      <div class="swiper-wrapper">
        <div class="swiper-slide " v-for="(datas,index) in swiperData" :key="index">
          <div class="swiper-slide-con" v-if="datas.stage.index == -1">
            <div class="num">0</div>
            <div class="title">
              <p>全部阶段</p>
              <p>全部赢率</p>
            </div>
            <div class="info">
              <p>总额</p>
              <p><i>
                <Number :value="datas.statistic.realPrice" type="currency" unit="元"></Number>
              </i></p>
              <p>{{datas.statistic.chanceCount}}个商机</p>
            </div>
          </div>

          <div class="swiper-slide-con" v-else>
            <div class="num">{{datas.stage.index}}</div>
            <div class="title">
              <p>{{datas.stage.name}}</p>
              <p>赢率{{datas.stage.rate}}%</p>
            </div>
            <div class="info">
              <p>总额</p>
              <p><i>
                <Number :value="datas.statistic.realPrice" type="currency" unit="元"></Number>
              </i></p>
              <p>{{datas.statistic.chanceCount}}个商机</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Add Pagination -->
    </div>
  </section>
</template>
<script>
  export default {
    NAME: 'swiper',

    props: {
      // [none, top, bottom, left, right, vertical, horizontal]
      swiperData: {
        type: Array
      }, initialSlide: {
        type: Number
      },
    },
    watch: {
      'swiperData'(val, oldVal) {
        this.$nextTick(function () {
          Promise.all([
            import('swiper'),
            import('swiper/dist/css/swiper.min.css')
          ]).then((resules) => {
            let [Swiper] = resules

            this.init(Swiper.default || Swiper);
          })
        });
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      init(Swiper) {
        let vm = this;

        new Swiper('.swiper-container', {
          pagination: '',
          observer: true,
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          initialSlide: this.initialSlide,
          coverflow: {
            rotate: 50,
            stretch: 0,
            depth: 80,
            modifier: 1,
            slideShadows: true
          },
          onTransitionEnd: function (swiper) {
            // 切换滑动回调
            // vm.$store.swiperStatus = vm.swiperData[swiper.activeIndex].stage.key;
            vm.$emit('setSwiperStatus', vm.swiperData[swiper.activeIndex].stage.key);
            vm.$emit('setSwiperInitialSlide', swiper.activeIndex);
          }
        });

      }
    }
  }
</script>
<style lang="less" scoped="">

  .swiper-container {
    width: 100%;
    margin: auto;
    padding: 2rem 0;
    color: #fff;
    .swiper-container-3d .swiper-slide-shadow-left {
      background-image: linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    }
    .swiper-container-3d .swiper-slide-shadow-right {
      background-image: linear-gradient(to right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    }
    .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 40vw;
      height: 40vw;
      position: relative;
      font-size: 1.2rem;
      border-radius: 0.5rem;
      overflow: hidden;
      transition: background-color .3s !important;

      .swiper-slide-con {
        position: absolute;
        z-index: 11;
        width: 100%;
        opacity: 0.9
      }
      .num {
        position: absolute;
        right: 1rem;
        top: 1rem;
        width: 1.6rem;
        height: 1.6rem;
        text-align: center;
        line-height: 1.6rem;
        background: #747474;
        border-radius: 100%;
        font-size: 1.6rem;
      }
      .title {
        margin: 1.6rem 1rem 1rem;
        line-height: 1.2rem;
      }
      .info {
        word-break: break-all;
        margin-left: 1rem;
        padding-top: 0.6rem;
        p:nth-child(2) {
          padding: 0.6rem 0 .3rem;
          i {
            font-size: 1.4rem;
          }
        }
      }

      &.swiper-slide-active {
        background-color: #3b7cec;
        color: #fff;

        .swiper-slide-con {
          opacity: 1
        }
        .num {
          background: #fff;
          color: #3b7cec
        }
      }
    }

  }
</style>
