<template>
  <Page>
    <h1>删除列表项</h1>
    <ul>
      <li v-for="(nickname, index) in list">
        <a @click="details(nickname)">{{index}} - {{nickname}}</a>-----------
        <a @click="del(nickname)">删除</a>
      </li>
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
      return {list: []}
    },

    /**
     * 组件初始化钩子
     */
    created: function () { this.loadData() },

    /**
     * 当前页面能调用的方法
     */
    methods: {

      loadData: async function () {
        let response = await this.$ajax.get('/sales.json')

        this.list = response.data.sales
      },

      /**
       * 删除
       */
      del: async function (nickName) {
        let res = await this.$ajax.get(`/sales.json?name=${nickName}`)

        if (res.status === 200) {
          // 移除已经被删除的数据，Vue会自动移除界面上对应的元素
          this.list = this.list.filter(function (name) {
            return name !== nickName
          })
        }
      },

      /**
       * 详情
       */
      details: function (name) {
        this.$router.push(`/sales/details?name=${name}`)
      }
    }
  }
</script>
