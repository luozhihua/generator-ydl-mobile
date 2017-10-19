<template>
  <Page>
    <h1>Index</h1>
    <ul>
      <li><a href="/examples/add">add</a></li>
      <li><a href="/examples/delete">delete</a></li>
      <li><a href="/examples/redirect">redirect</a></li>
      <li><a href="/examples/infinite-load">infinite-load</a></li>
    </ul>
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
      }
    }
  }
</script>
