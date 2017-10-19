<template>
  <Page>
    <header slot="header">
      <h1>标题</h1>
    </header>

    <ul>
      <li v-for="(nickname, index) in list" @click="itemClick(index, nickname)" :key="index">
        {{index}} - {{nickname}}
      </li>
    </ul>

    <footer slot="footer">
      <button @click="ok()">确定</button>
    </footer>
  </Page>
</template>

<script>
  export default {

    /**
     * 默认数据
     */
    data: function () {
      return {list: []}
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
      init: async function () {
        let response = await this.$ajax.get('/sales.json')

        this.list = response.data.sales
      }
    }
  }
</script>

<style lang="less" scoped>
  h1 {
    color: red;
  }
</style>
