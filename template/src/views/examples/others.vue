<template>
  <Page>
    <h1>销售</h1>
    <ul>
      <li v-for="(nickname, index) in list" @click="itemClick(index, nickname)">
        {{index}} - {{nickname}}
      </li>
    </ul>

    <!--由权限控制的按钮： v-previlege="xxx" -->
    <button v-privilege="1" @click="plus()">按钮</button>

    <button @click="plus()">按钮</button>
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
        x: 1,
        y: 2,
        list: []
      }
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
        this.$ajax.get('/sales.json').then(response => {
          this.list = response.data.sales
        })
        this.runExamples()
      },

      runExamples: function () {

        // 本地存储
        this.$storage.setItem('a', 123)
        console.log(this.$storage.getItem('a'))

        // 获取地址栏参数
        // 假设当前页面的queryString 为：?bar=1&foo=2
        console.log(this.$route.query.bar) // => 1
        console.log(this.$route.query.foo) // => 2

        // 页面跳转(为了防止页面跳转，下面几行被注释)
        // this.$router.push('/path/to/new/page?bar=1&foo=2')
        // this.$page.back() // 后退

        //  AJAX 数据加载
        this.$ajax.get('/sales.json').then(response => {
          console.log(response.data);
          console.log(response.status);
          console.log(response.statusText);
          console.log(response.headers);
          console.log(response.config);
        })

        /**
         * AJAX 提交数据
         */
        this.$ajax.post('/sales.json', this.data).then(response => {
          console.log(response.data);
          console.log(response.status);
          console.log(response.statusText);
          console.log(response.headers);
          console.log(response.config);
        })
      },

      itemClick: function (index, name) {
        this.$router.push(`/sales/details?name=${name}`)
      },

      say: function (msg) {
        alert(msg)
      },

      plus: function () {
        let result = this.x + this.y;

        this.say(result)
      }
    }
  }
</script>
