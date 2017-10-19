<template>
  <div :class="className" :style="styles">

    <div class="app-view-container" ref="container">
      <router-view></router-view>
    </div>

    <nav v-if="$store.state.frame.navVisible" :class="navClassName">
      <li :class="getItemClass('home')" @click="setHighlight('home')">
        <a href="/home">
          <i class="icon shouye" :class="{'shouye1': getItemClass('home',1) }"></i>
          首页
        </a>
      </li>
      <li :class="getItemClass('analysis')" @click="setHighlight('analysis')">
        <a href="/analysis">
          <i class="icon shujufenxi" :class="{'shujufenxi1': getItemClass('analysis',1) }"></i>
          数据分析
        </a>
      </li>

      <li class="mingpiansaomiao_box">
        <a class="icon shouyesaomiao" href="javascript:void(0)" :class="{'mingpiansaomiao—anmation':saomiaoFlag}">
          <input ref="file" @change="saoMiao($event)" type="file" id="file" capture="camera" accept="image/*" name="file"/>
        </a>
      </li>
      <li class="add-button" v-if="false">
        <a @click="toggleNavList()" href="javascript:void(0)"></a>

        <transition name="slideInUp">
          <div :class="navListClass">
            <ul>
              <li><a href="">1</a></li>
              <li><a href="">2</a></li>
              <li><a href="">3</a></li>
              <li><a href="">4</a></li>
              <li><a href="">5</a></li>
              <li><a href="">6</a></li>
              <li><a href="">7</a></li>
              <li><a href="">8</a></li>
              <li><a href="">9</a></li>
              <li><a href="">10</a></li>
            </ul>
          </div>
        </transition>
      </li>
      <li :class="getItemClass('crm')" @click="setHighlight('crm')">
        <a href="/crm">
          <i class="icon crm" :class="{'crm1': getItemClass('crm',1) }"></i>
          CRM
        </a>
      </li>
      <li :class="getItemClass('profile')" @click="setHighlight('profile')">
        <a href="/my-related">
          <i class="icon my" :class="{'my1': getItemClass('profile',1) }"></i>
          我的
        </a>
      </li>
    </nav>

    <div class="toast-panel">
      <Toast v-for="(toast, index) in toasts" :key="index"></Toast>
    </div>

    <div class="widgets">
      <WidgetPlane v-if="$store.state.frame.visibled" api="/api/salesRank/queryGoodSalesRankInfo?type=1"></WidgetPlane>
      <WidgetCrow v-if="$store.state.frame.visibled" api="/api/salesRank/queryGoodSalesRankInfo?type=2"></WidgetCrow>

      <!--<WidgetPlane v-if="$store.state.frame.visibled" api="/vue/widgets-plane.json"></WidgetPlane>-->
      <!--<WidgetCrow v-if="$store.state.frame.visibled" api="/vue/widgets-crow.json"></WidgetCrow>-->
    </div>
  </div>
</template>

<script>
  import Backbutton from '../../utils/backbutton'
  import WidgetPlane from '../widgets/plane/'
  import WidgetCrow from '../widgets/crow/'

  export default {
    NAME: 'Frame',

    components: {
      WidgetPlane,
      WidgetCrow
    },

    props: {
      visibled: {type: Boolean, default: false}
    },

    data() {
      return {
        appHeight: '',
        highlight: 'crm',
        navListVisible: false,
        saomiaoFlag: false,
        isManager: this.$storage.getItem('isManager'),
        keybordActive: false
      }
    },

    computed: {

      className() {
        return {
          'app-view': true,
          'loading': this.$store.state.frame.loading,
          'keybord-active': this.keybordActive
        }
      },

      styles() {
        return {
          height: this.appHeight
        }
      },

      navListClass() {
        return {
          'nav-list': true,
          'hide': !this.navListVisible
        }
      },

      navClassName() {
        return {
          'footer-nav': true,
          'hide': !this.$store.state.frame.navVisible
        }
      },

      toasts() {
        return this.$store.state.toast.list
      }
    },

    mounted() {
      const CAPTURING = true
      let vm = this

      this.$el.addEventListener('focus', function (event) {
        let target = event.target || event.srcTarget

        if (vm.isElementToActiveKeyboard(target)) {
          if (typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({behavior: 'smooth', block: 'start'})

            setTimeout(() => {
              target.scrollIntoView({behavior: 'smooth', block: 'start'})
            }, 500)
          }
        }
      }, CAPTURING)
    },

    methods: {

      /**
       * 是否是能触发手机虚拟键盘的元素
       */
      isElementToActiveKeyboard(target) {
        let tagName = (target.nodeName || target.tagName).toUpperCase()
        let formItems = ['INPUT', 'TEXTAREA']
        let isFormItem = formItems.indexOf(tagName) !== -1
        let isContentEditor = target.getAttribute('contenteditable')
        let isDisabled = target.getAttribute('disabled')
        let isReadonly = target.getAttribute('readonly')

        return isContentEditor || (isFormItem && !isDisabled && !isReadonly)
      },

      toggleNavList() {
        this.navListVisible = !this.navListVisible

        if (this.navListVisible) {
          Backbutton.prevent(() => {
            this.navListVisible = !this.navListVisible
          })
        } else {
          Backbutton.remove()
        }
      },

      setHighlight(id) {
        this.$store.commit('setActiveNav', id)
      },

      getItemClass(id, type) {
        let cssClass

        if (type) {
          if (id === this.$store.state.frame.activeNav) {
            cssClass = true
          }
        } else {
          cssClass = {
            'active': id === this.$store.state.frame.activeNav
          }
        }

        return cssClass
      },

      //扫描
      saoMiao(e) {
        let vm = this;

        this.saomiaoFlag = true;
        this.saomiao(e, {}, function (data) {
          window.scanData = data;
          vm.$router.push('/scan-card');
          vm.$refs.file.value = '';
          vm.saomiaoFlag = false;
        }, function () {
          vm.$refs.file.value = '';
          vm.saomiaoFlag = false;
        });

      },
    }
  }
</script>

<style lang="less" scoped="">
  @import url('./style');
</style>
