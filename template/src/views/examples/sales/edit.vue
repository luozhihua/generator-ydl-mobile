<template>
  <Page>
    <h1 slot="header">Title</h1>


    Y: <input type="text" v-model="x"> <br>
    X: <input type="text" v-model="y"> <br>
    用户名：<input type="text" v-model="sales"> <br>

    <hr>

    <button @click="save()">保存</button>
    <footer slot="footer">
      footer
    </footer>
  </Page>
</template>

<script>
  export default {

    /**
     * 默认数据
     */
    data: function () {
      return {
        x: 1,
        y: 2,
        sales: []
      }
    },

    created: function () {
      this.loadData()
    },

    methods: {
      loadData: function () {
        this.$ajax.get('/sales.json').then(response => {
          this.sales = response.data.sales[0]
        })
      },

      save: function () {
        console.log(this.sales)
      }
    }
  }
</script>

<style scoped="">
  button {
    background-color: #00a8ff;
    border: 0px;
    border-radius: 5px;
    padding: 6px 10px;
  }
</style>
