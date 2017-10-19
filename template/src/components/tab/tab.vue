<template>
  <div class="tab-select">
    <div class="tab-select-title yd-icon"
         :class="{'yd-triangledownfill':!isShow,'yd-triangleupfill':isShow}"
         @click="isShow=isShow ? false : true">
      <span style="font-family: PingFangSC-Regular">{{title.name + queryParms.title}}</span>
    </div>

    <ul v-if="isShow">
      <li v-for="(item, index) in queryParms.data"
          :key="item.key"
          :class="{'curr':item.key==title.key ? true: false}"
          @click="handleActive(item)" class="text-center"
      >{{item.name}}
      </li>
    </ul>
  </div>

</template>
<script>
  export default {
    NAME: 'mars-tab',
    ALIAS: ['tab', 'Tab'],

    /**
     * 默认数据
     */
    props: {
      queryParms: {type: Object}
    },

    data: function () {
      return {
        title: {
          name: this.queryParms.data[0].name,
          key: this.queryParms.data[0].key
        },
        isShow: false,
      }
    },

    /**
     * 组件初始化钩子
     */
    created: function () {
    },

    mounted() {

    },

    watch: {},

    methods: {
      handleActive (item) {
        this.isShow = false;
        this.activeTab = item.key;
        this.title = item;
        this.queryParms.selectCallback(item);
      }
    }
  }
</script>

<style lang="less" scoped="scoped">

  .tab-select {
    .tab-select-title {
      font-size: 1.5rem;
      padding-bottom: 1rem;
      font-family: PingFangSC-Medium;
      color: #747474;
      font-weight: 500;
    }
    .yd-icon:before {
      float: right;
      margin-left: 1rem;
      color: #747474;
      font-size: 1rem;
      position: relative;
      top: 0.3rem;
    }
    ul {
      display: flex;
      font-size: 1.4rem;
      li {
        flex: 1;
        background: #fff;
        color: #999;
        border-radius: 0.5rem;
        padding: 1rem 1rem;
        line-height: 1.4rem;
      }
      li:nth-child(3n-1) {
        margin: 0 1rem;
      }
      .curr {
        background: #E1EBFA;
        color: #3B7CEC;
      }
    }
  }

</style>

