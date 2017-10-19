<template>
  <div>
    <audio :src="voice" preload="preload" ref="audio"></audio>

    <div class="posi-fixed bg-00 dspn" ref="animationCrow">
      <div class="title">
        <h2>
          <span>业</span>
          <span>绩</span>
          <span>最</span>
          <span>差</span>
          <span>排</span>
          <span>名</span>
        </h2>
      </div>
      <div class="branch">
        <img :src="imgBranch"/>
      </div>
      <ul class="crow-box" ref="crow-box">
        <li v-for="(item,index) in list" :class="'crow' + (index + 1)" :key="item.name">
          <div class="cloud">
            <p class="no">No.{{index + 1}}</p>
            <p class="name">{{item.name}}</p>
            <img class="bluecloud" :src="imgCloud"/>
            <img class="whitecloud" :src="imgCloud11"/>
          </div>
          <div class="crow">
            <img class="c1" :src="imgCrow1"/>
            <img class="c2" :src="imgCrow2"/>
            <img class="c3" :src="imgCrow3"/>
            <img class="c4" :src="imgCrow4"/>
            <img class="c5" :src="imgCrow5"/>
            <img class="c6" :src="imgCrow6"/>
            <img class="c7" :src="imgCrow7"/>
            <img class="c8" :src="imgCrow8"/>
            <img class="c9" :src="imgCrow9"/>
            <img class="c10" :src="imgCrow10"/>
            <img class="c11" :src="imgCrow11"/>
            <img class="c12" :src="imgCrow12"/>
            <img class="c13" :src="imgCrow13"/>
            <img class="c14" :src="imgCrow14"/>
            <img class="c15" :src="imgCrow15"/>
            <img class="c16" :src="imgCrow16"/>
            <img class="placeholder1" :src="imgCrow14"/>
          </div>
          <div class="lightning"></div>
          <div class="rain rain1"></div>
          <div class="rain rain2"></div>
          <div class="rain rain3"></div>
          <div class="rain rain4"></div>
          <div class="rain rain5"></div>
          <div class="rain rain6"></div>
        </li>
      </ul>
      <div class="close" @click="close"></div>
      <div class="horn" @click="toggleVoice"></div>
    </div>
  </div>
</template>

<script>
  import voice from './crow.mp3'

  export default {

    // s
    props: {
      list: {type: Array}
    },

    data() {
      return {
        voice: '',
        imgCrow1: '',
        imgCrow2: '',
        imgCrow3: '',
        imgCrow4: '',
        imgCrow5: '',
        imgCrow6: '',
        imgCrow7: '',
        imgCrow8: '',
        imgCrow9: '',
        imgCrow10: '',
        imgCrow11: '',
        imgCrow12: '',
        imgCrow13: '',
        imgCrow14: '',
        imgCrow15: '',
        imgCrow16: '',
        imgBranch: '',
        imgCloud: '',
        imgCloud11: ''
      }
    },

    mounted: function () {
      this.voice = voice
      this.$ajax.seine(this.loadImgs([
        'crow1.png',
        'crow2.png',
        'crow3.png',
        'crow4.png',
        'crow5.png',
        'crow6.png',
        'crow7.png',
        'crow8.png',
        'crow9.png',
        'crow10.png',
        'crow11.png',
        'crow12.png',
        'crow13.png',
        'crow14.png',
        'crow15.png',
        'crow16.png',
        'branch.png',
        'cloud.png',
        'cloud11.png',
      ])).then((list) => {
        this.imgCrow1 = list[0]
        this.imgCrow2 = list[1]
        this.imgCrow3 = list[2]
        this.imgCrow4 = list[3]
        this.imgCrow5 = list[4]
        this.imgCrow6 = list[5]
        this.imgCrow7 = list[6]
        this.imgCrow8 = list[7]
        this.imgCrow9 = list[8]
        this.imgCrow10 = list[9]
        this.imgCrow11 = list[10]
        this.imgCrow12 = list[11]
        this.imgCrow13 = list[12]
        this.imgCrow14 = list[13]
        this.imgCrow15 = list[14]
        this.imgCrow16 = list[15]
        this.imgBranch = list[16]
        this.imgCloud = list[17]
        this.imgCloud11 = list[18]

        this.start()
      })

    },

    methods: {

      loadImgs(imgs) {
        let results = []

        imgs.forEach((imgName) => {
          results.push(import(`../plane/img/${imgName}`))
        })

        return results
      },

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
       * 开始动画
       */
      start() {
        let vm = this;

        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        this.voiceStatus = true;
        this.$refs.animationCrow.classList.add('second-animation');
        this.$nextTick(function () {
          let crowList = vm.$refs['crow-box'].getElementsByTagName('li'),
            len = crowList.length,
            last = crowList[len - 1].querySelector('.crow');

          for (let i = 0; i < len; i++) {
            vm.bindEvent(crowList[i], 'animationend', function () {
              this.classList.add('drop');
            })
          }

          vm.bindEvent(last, 'animationend', function () {
            vm.close()
          })
        })
      },

      // 播放或暂停声音
      toggleVoice: function () {
        if (this.voiceStatus) {
          this.$refs.audio.pause();
          this.voiceStatus = false;
        } else {
          this.$refs.audio.play();
          this.voiceStatus = true;
        }
      },

      // 关闭动画
      close: function () {
        this.$emit('stop')
        this.$refs.animationCrow.classList.remove('second-animation')
        this.$refs.audio.pause();
        this.voiceStatus = false;
        this.list = [];
      }
    }
  }
</script>

<style lang="less" scoped="">
  @import url('./style.less');
</style>

<style lang="less">
  @import url('../plane/css/animate.css');
</style>
