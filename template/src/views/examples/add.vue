<template>
  <Page>
    <h1>销售列表（新增）</h1>
    <ul>
      <li v-for="(nickname, index) in list">
        <a @click="details(nickName)">{{index}} - {{nickname}}</a>
      </li>
    </ul>

    <button @click="openAddDialog()"> 新增 </button>

    <!-- 填写新增信息的弹框 -->
    <modal name="modal-add">
      <input type="text" v-model="newName" style="border: 1px solid red; padding: 8px">
      <button @click="save()">保存</button>
    </modal>
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
      return {
        newName: '',
        list: []
      }
    },

    /**
     * 组件初始化钩子
     */
    created: function () {
      this.loadData()
    },

    /**
     * 当前页面能调用的方法
     */
    methods: {

      loadData: async function () {
        let response = await this.$ajax.get('/sales.json')

        this.list = response.data.sales
      },

      /**
       * 新增
       */
      openAddDialog: function () {
        this.$modal.show('modal-add');
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
          this.$modal.hide('modal-add')
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
