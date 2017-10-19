<template>
  <Page>
    <h1>页面跳转</h1>
    <ul>
      <li><a @click="redirect('习近平')">习近平</a></li>
      <li><a @click="redirect('温家宝')">温家宝</a></li>
      <li><a @click="redirect('李克强')">李克强</a></li>
      <li><a @click="redirect('江泽民')">江泽民</a></li>
      <li><a @click="redirect('李鹏')">李鹏</a></li>
    </ul>
    <hr>
    <h1>销售员：{{$query.username}}</h1>
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
      init() {
        console.log(this.$route.query.username)
      },

      redirect(person) {
        this.$router.push(`/examples/redirect?username=${person}`)
      }
    }
  }
</script>
