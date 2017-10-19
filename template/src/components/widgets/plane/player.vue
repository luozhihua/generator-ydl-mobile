<template>
  <div>
    <audio :src="voice" preload="preload" ref="voice"></audio>

    <div class="posi-fixed bg-00 dspn fadeIn" ref="animationAircraft">
      <div class="clond-box" ref="clondBox">
        <div class="first"></div>
        <div class="second"></div>
        <div class="third"></div>
      </div>
      <div class="aircraft-box">
        <div class="aircraft-wrapper">
          <div class="aircraft" ref="aircraft">
            <div class="aircraft-main"></div>
            <img src="img/tail.png"/>
          </div>
        </div>
      </div>
      <div class="posi-fixed bg-ff" ref="bgFf"></div>
      <div class="posi-fixed bg-f2c-box">
        <div class="posi-fixed bg-f2c">
          <div class="main-box">
            <p class="time">{{ yestoday }}</p>
            <h2>
              <span>销售之星 TOP {{ others.length + 1 }}</span>
            </h2>
            <ul>
              <li class="first">
                <h3>
                  No.1 {{first.name}}
                  <span></span>
                </h3>
                <div class="chassis"></div>
                <div class="sofa-first">
                  <div class="sofa-first-main"></div>
                </div>
                <div class="teatable"></div>
                <div class="bag"></div>
                <div class="person">
                  <div class="person-main">
                    <div class="arm"></div>
                    <div class="main"></div>
                    <div class="photo">
                      <div class="crown"></div>
                      <div class="head-circle">
                        <img :src="first.url"/>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li class="others second" :class="'others' + (index + 1)" v-for="(item,index) in others" :key="item.name">
                <h3>
                  <span>No.{{index + 1}} {{item.name}}</span>
                </h3>
                <div class="person" :class="{'man': item.sex, 'woman': !item.sex}"></div>
                <div class="photo">
                  <div class="crown"></div>
                  <div class="head-circle">
                    <img :src="item.url"/>
                  </div>
                </div>
                <div class="mask"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="close" @click="close"></div>
      <div class="horn" @click="toggleVoice"></div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import voice from './plane.mp3'

  export default {

    props: {
      list: {type: Array}
    },

    data() {
      let yestoday = moment().add(-1, 'day')

      return {
        first: {},
        others: [],
        list: [],
        voice: voice,
        audioSwitch: false,
        yestoday: yestoday.format('YYYY年MM月DD日')
      }
    },

    mounted: function () {
      let vm = this
      let {bgFf, aircraft, clondBox} = this.$refs
      let event = 'animationend'

      this.bindEvent(bgFf, event, function () {
        setTimeout(function () {
          bgFf.style.display = 'none';

        }, 1000);
      });

      // 动画结束
      this.bindEvent(aircraft, event, function () {
        setTimeout(function () {
          vm.close();
        }, 300)
      });

      this.bindEvent(clondBox, event, function () {
        setTimeout(function () {
          clondBox.style.display = 'none'
        }, 1000)
      });

      this.start()
    },
    methods: {

      bindEvent(elem, event, action) {
        let prefix = ['webkit', 'moz', 'o', 'ms']

        prefix.forEach((vendor) => {
          let upper = function (str) {
            return str.toUpperCase()
          }

          vendor += event.replace(/^([a-z])/gi, upper)
          elem.addEventListener(vendor, action)
        })
        elem.addEventListener(event, action)
      },

      /**
       * 开始
       * @param list
       */
      start: function (list) {
        list = list || this.list

        this.first = list.splice(1, 1)[0];
        this.others = list;
        this.audioSwitch = true;
        this.$refs.voice.currentTime = 0;
        this.$refs.voice.play();
        this.$refs.animationAircraft.classList.add('first-animation');
      },

      /**
       * 播放声音
       */
      toggleVoice: function () {
        if (this.audioSwitch) {
          this.$refs.voice.pause();
          this.audioSwitch = false;
        } else {
          this.$refs.voice.play();
          this.audioSwitch = true;
        }
      },

      /**
       * 关闭动画
       */
      close: function () {
        this.$emit('stop')
        this.$refs.animationAircraft.classList.remove('first-animation')
        this.$refs.voice.pause();
        this.audioSwitch = false;
      }
    }
  }
</script>

<style lang="less" scoped="">
  @import url('./css/style.less');
</style>
<style lang="less">
  @import url('./css/animate.css');
</style>
