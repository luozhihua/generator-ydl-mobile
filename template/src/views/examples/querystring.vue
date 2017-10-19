<template>
  <Page>
    <h1>获取地址参数</h1>
    <h4>销售员：{{$query.username}}</h4>
  </Page>
</template>

<style lang="less" scoped>
  li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
</style>

<script>
  export default {

    /**
     * 默认数据
     */
    data: function () {
      return {}
    },

    /**
     * 组件初始化钩子
     */
    created: function () {
      this.init()
    },

    /**
     * 当前页面能调用的方法
     */
    methods: {
      init: function () {
        console.log(this.$route.query.username)
      }
    }
  }
</script>
