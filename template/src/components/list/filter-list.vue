<template>
  <div class="js-filter-list">
    <div class="filter-box">
      <i class="icon search"></i>
      <input v-model="value" :placeholder="placeholder" type="text" v-on:focus="focusValue($event)"
             @blur="blurValue($event)">
      <div class="mu-dropDown">
        <mu-select-field class="panel-title-select"
                         v-model="searchDefaultValue"
                         @change="onConditionChange"
                         :labelFloat="true"
                         v-if="showMueSelect"
                         :underlineShow="false"
                         :autoWidth="true">
          <mu-menu-item v-for="menu,index in menus"
                        :key="menu.text"
                        :value="index"
                        :title="menu.text"/>
        </mu-select-field>
      </div>

    </div>

    <div class="container" @touchmove="slide()">
      <div>
        <slot></slot>
      </div>

      <infinite-loading @infinite="load" ref="infinite">
        <Wave slot="spinner">正在努力加载...</Wave>
        <span class="no-more" slot="no-more">没有更多了</span>
        <div slot="no-results" class="no-data">
          <i class="icon Nodata"></i>
          <p>暂时没有数据</p>
        </div>
      </infinite-loading>
    </div>

    <transition name="plus-anim">
      <mu-float-button ref="plusButton" v-if="isShowPlusButton" class="btn-plus" @click="onPlusClick">
        <Icon name="yd-jiahao1" color="#FFFFFF" size="1.9rem"></Icon>
      </mu-float-button>
    </transition>
  </div>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading'

  const TIMEOUT = 300
  let timer

  export default {

    components: {
      InfiniteLoading
    },

    NAME: 'FilterList',

    props: {
      'showMueSelect': {type: Boolean, default: true},
      'url': {type: String},
      'placeholder': {type: String, default: '搜索...'},
      'showPlusButton': {type: Boolean, default: true},
      'searchBy': {type: String, default: 'keyword'},
      'keyword': {type: String, default: ''},
      'params': {type: Object, default: () => {return {}}},
      'onPlusClick': {type: Function, default: function () {}},
      'index': {type: Number, defalt: 0},
      'searchCondition': {type: String, defalt: '全部的'},
      'menus': {type: Array, defalut: []},
      'pageSize': {type: Number, default: 10},
      'currentPage': {type: Number, default: 1},
      'searchConditionValue': {type: Number, default: 0},
    },

    data() {
      let searchDefaultValue = parseInt(sessionStorage.getItem(this.getSeachTypeIndex()))
      return {
        list: [],
        pageNumber: this.currentPage,
        searchDefaultValue: searchDefaultValue || this.searchConditionValue, //记录页面的搜索条件
        value: '',
        selectedUrl: '',
        isTrue: false
      }
    },

    computed: {
      newKeyword() {
        return this.value || this.keyword
      },
      isShowPlusButton() {
        return this.showPlusButton && !this.$store.state.frame.navVisible
      },
    },

    watch: {
      searchDefaultValue(index) {
        let seachTypeId = this.getSeachTypeId()
        let seachTypeIndex = this.getSeachTypeIndex()
        this.selectedUrl = this.menus[index].url
        sessionStorage.setItem(seachTypeId, this.selectedUrl)
        sessionStorage.setItem(seachTypeIndex, index)
        clearTimeout(timer)
        this.$emit('clearParam')
        this.reset()
      },

      value() {
        clearTimeout(timer)

        // 延迟请求，避免输入时连续多次发起 AJAX请求
        timer = setTimeout(() => {
          this.reset()
        }, TIMEOUT)
      },

      list(list) {
        this.$emit('input', list || [])
      },

      // 外部参数监听
      params: {
        handler() {
          // 通知分页组件加载完成
          this.reset()
        },
        deep: true
      }
    },

    mounted() {
      let btn = this.$refs.plusButton

      if (btn) {
        document.body.appendChild(btn.$el)
      }
    },

    beforeDestroy() {
      let btn = this.$refs.plusButton

      if (btn) {
        btn.$el.parentNode.removeChild(btn.$el)
      }
    },

    methods: {

      getSeachTypeId() {
        return `SEACH_TYPE_ITEM_${encodeURIComponent(location.pathname)}`
      },
      getSeachTypeIndex() {
        return `SEACH_TYPE_INDEX_${encodeURIComponent(location.pathname)}`
      },

      async load($state) {
        let seachTypeId = this.getSeachTypeId()
        let recallUrl = sessionStorage.getItem(seachTypeId)
        let url = recallUrl || this.selectedUrl || this.url
        let params = Object.assign({}, this.params)
        let res

        params.pageSize = 10
        params.currentPage = this.pageNumber++
        params[this.searchBy] = this.newKeyword

        if (this.searchCondition) {
          params[this.searchCondition] = this.searchDefaultValue
        }

        try {
          res = await this.$ajax.get(url, {params: params})

          if (res.data && res.data.length > 0) {
            this.list = this.list.concat(res.data)
          }

          // 通知分页组件加载完成
          $state.loaded()
          //this.$refs.infinite.$emit('$InfiniteLoading:loaded')

          // 没有更多数据时通知加载组件
          if (!res.data || res.data.length < res.pageSize) {
            $state.complete()
            // this.$refs.infinite.$emit('$InfiniteLoading:complete')
          }
        } catch (e) {
          console.log(e)

          // 没有更多数据时通知加载组件
          $state.complete()
          // this.$refs.infinite.$emit('$InfiniteLoading:complete')
        }
      },

      reset() {
        this.pageNumber = 1
        this.list = []
        this.$refs.infinite.stateChanger.reset()
        // this.$refs.infinite.$emit('$InfiniteLoading:reset')
      },

      onConditionChange() {
        let index = this.searchDefaultValue
        let condition = this.menus[index]

        this.$emit('conditionChange', condition)
      },

      focusValue(event) {
        this.isTrue = true
        this.$emit('focusFix', this.isTrue)
      },
      blurValue(event) {
        this.isTrue = false
        this.$emit('focusFix', this.isTrue)
      },
      slide() {
        this.isTrue = false
        this.$emit('focusFix', this.isTrue)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('../../styles/icons.less');
  // @import url("data:application/octet-stream;base64,QGNvbG9yLXByaW1hcnk6ICMzQjdDRUM7DQpAY29sb3Itc3VjY2VzczogIzE3YTIxZjsNCkBjb2xvci1pbmZvOiAjODNlM2ViOw0KQGNvbG9yLWVycm9yOiAjRkYxQjQzOw0KDQpAdGhpbjoxMDA7DQpAbGlnaHQ6MzAwOw0KQG5vcm1hbDo0MDA7DQpAbWVkaXVtOjUwMDsNCkBib2xkOjcwMDsNCkBib2xkOjkwMDsNCg==");

  .js-filter-list {
    position: relative;
    margin: 0 1.5rem;
    background-color: #fff;
    box-shadow: 0 .2rem .2rem rgba(0, 0, 0, 0.08);
    padding-top: 2rem;
    overflow: hidden;
    font-family: "Roboto";
    font-weight: 400;
    .filter-box {
      overflow: hidden;
      position: relative;
      display: flex;
      jsutify-content: space-around;
      border: 1px solid #979797;
      border-radius: .4rem;
      height: 3rem;
      margin: 0 1rem 1.6rem 1rem;
      .icon {
        position: absolute;
        top: .5rem;
        left: -.4rem;
        margin: 0;
        width: 1.8rem;
        height: 1.8rem;
      }

      input {
        display: block;
        width: 78%;
        border: none;
        color: #bebebe;
        font-size: 1.4rem;
        height: 100%;
        line-height: normal;
        margin-left: 4rem;
        // &:focus,
        // &:active {
        //   box-shadow: inset 0 0 .2rem rgba(0,0,0,0.1);
        // }
      }
      .mu-dropDown {
        width: 12.5rem;
        .mu-text-field {
          background-color: @color-primary;
          // margin: auto 0 ;
          height: 100%;
          min-heigh: 2rem;
          font-size: 1.6rem;
          width: 100%;
        }
      }
    }

    .container {
      position: relative;
      border-radius: 0 0 1rem;
    }
    //-------- 没数据页面 start---------
    .no-data {
      position: relative;

      .icon {
        width: 90vw;
        height: 24vh;
        margin-top: 5.2rem;
        margin-bottom: 48vh;
      }

      p {
        position: absolute;
        top: 294%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        box-shadow: 0 -2px 42px #eaf1ff;
        opacity: 0.99;
        font-weight: 200;
        font-size: 1.4rem;
        color: #999;
        display: block;
        margin: auto;
        width: 300vw;
        height: 100vh;
        border-radius: 50%;
        text-align: center;
        line-height: 4rem;
      }
    }
    //  -----没数据页面 end----------
  }

  .btn-plus {
    position: fixed;
    right: 3.6rem;
    bottom: 3.6rem;
    width: 5.6rem;
    height: 5.6rem;
    background-color: @color-primary;
    z-index: 11111111;
  }

  .no-more {
    display: block;
    padding: 1rem 0;
    font-weight: 200;
    color: #d6d6d6;

    &:before, &:after {
      content: '-';
      display: inline-block;
      padding: 0 1rem;
      color: #e8e8e8;
    }
  }

  /* Plus Button Animations */
  .plus-anim-enter-active {
    animation: plus-anim-in .3s;
    animation-timing-function: cubic-bezier(.46, -1.16, .32, 1.93);
    z-index: 1;
  }

  .plus-anim-leave-active {
    animation: plus-anim-out .3s;
    animation-timing-function: cubic-bezier(.46, -1.16, .32, 1.93);
  }

  @keyframes plus-anim-in {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes plus-anim-out {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  .mu-popover {
    top: 5rem;
  }
</style>
