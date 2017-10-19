<template>
  <Page>
    <h1>销售列表(无限加载)</h1>
    <ul>
      <li v-for="(nickname, index) in list">
        <a @click="details(nickName)">{{index}} - {{nickname}}</a>
      </li>
    </ul>

    <infinite-loading :on-infinite="loadData" ref="infinite">
      <span slot="no-more">- 没有更多了 -</span>
    </infinite-loading>
  </Page>
</template>

<style lang="less" scoped>
</style>

<script>
  import InfiniteLoading from 'vue-infinite-loading'

  export default {

    components: {
      InfiniteLoading
    },

    /**
     * 默认数据
     */
    data: function () {
      return {
        currentPage: 1,
        list: []
      }
    },

    /**
     * 组件初始化钩子
     */
    created: function () {},

    /**
     * 当前页面能调用的方法
     */
    methods: {

      loadData: async function () {

        this.currentPage += 1;
        let response = await this.$ajax.get(`/sales.json?page=${this.currentPage}`)

        this.list = this.list.concat(response.data.sales)

        // 通知分页组件加载完成
        this.$refs.infinite.$emit('$InfiniteLoading:loaded')

        // 没有更多数据时通知加载组件
        if (response.data.sales.length === 0 || this.list.length > 950) {
          this.$refs.infinite.$emit('$InfiniteLoading:complete')
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
