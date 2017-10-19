<template>
  <Page>
    <h1>销售列表</h1>
    <ul>
      <li v-for="(nickname, index) in list">
        <a @click="details(nickname)">{{index}} - {{ formatter(nickname) }}</a>

        <a @click="edit(nickname)" v-privilege="2">编辑</a>
        <a @click="del(nickname)">删除</a>
      </li>
    </ul>

    <infinite-loading :on-infinite="loadData" ref="infinite">
      <span slot="no-more">- 没有更多了 -</span>
    </infinite-loading>

    <button @click="openAddDialog()"> 新增 </button>

    <!-- 填写信息信息的弹框 -->
    <mu-dialog :open="dialogVisibled" title="Dialog">

      <input type="text" v-model="newName" style="border: 1px solid red; padding: 8px">
      <button @click="save()">保存</button>
    </mu-dialog>

    <footer slot="footer">

    </footer>
  </Page>
</template>

<style lang="less" scoped>
  li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
</style>

<script>
  //  import Dialog from 'muse-ui/src/dialog'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {

    components: {
      //      'mu-dialog': Dialog,
      InfiniteLoading
    },

    /**
     * 默认数据
     */
    data: function () {
      return {
        dialogVisibled: false,
        newName: '',
        list: []
      }
    },

    /**
     * 组件初始化钩子
     */
    created: function () {

    },

    /**
     * 当前页面能调用的方法
     */
    methods: {

      loadData: async function () {
        let response = await this.$ajax.get('/sales.json')

        this.list = this.list.concat(response.data.sales)

        // 通知分页组件加载完成
        this.$refs.infinite.$emit('$InfiniteLoading:loaded')

        // 没有更多数据时通知加载组件
        if (response.data.sales.length === 0 || this.list.length > 50) {
          this.$refs.infinite.$emit('$InfiniteLoading:complete')
        }
      },

      formatter(a) {
        return a + 'xxx'
      },

      /**
       * 新增
       */
      openAddDialog: function () {
        this.dialogVisibled = true
      },

      /**
       * 保存数据
       */
      save: async function () {
        let saveResult = await this.$ajax.get(`/sales.json?add=${name}`)

        // 保存成功后，将数据显示到界面上（只需将新增的数据 push 到 this.list, Vue会自动感知并更新界面）
        if (saveResult.status === 200) {
          this.list.push(this.newName)
          this.newName = ''
          this.dialogVisibled = false

          // this.$refs.infinite.$emit('$InfiniteLoading:reset')
        }
      },

      /**
       * 详情
       */
      details: function (name) {
        this.$router.push(`/sales/details?name=${name}`)
      },

      /**
       * 编辑
       */
      edit: function (name) {
        this.$router.push(`/sales/details?name=${name}`)
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
      }
    }
  }
</script>
