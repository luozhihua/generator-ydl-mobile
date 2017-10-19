<template>
  <Page title="数据分析" nav-group="analysis" :nav-hidden="false">
    <Goal :delay="0"></Goal>
     <!-- 暂时模拟背景 -->
    <div class="gray-box"></div>
    <Achievements :delay="0"></Achievements>
     <!-- 暂时模拟背景 -->
    <div class="gray-box"></div>
    <SalesFunnel :delay="500"></SalesFunnel>
     <!-- 暂时模拟背景 -->
    <div class="gray-box"></div>
    <Visit :delay="700"></Visit>
     <!-- 暂时模拟背景 -->
    <div class="gray-box"></div>
    <GrowthOfTeam :delay="900"></GrowthOfTeam>
  </Page>
</template>

<script>
  import Goal from './panels/goal.vue'
  import Achievements from './panels/achievements.vue'
  import SalesFunnel from './panels/funnel.vue'
  import Visit from './panels/visit.vue'
  import GrowthOfTeam from './panels/growth.vue'

  export default {

    components: {
      Achievements,
      SalesFunnel,
      Goal,
      Visit,
      GrowthOfTeam
    },

    data() {
      return {
        goalDialog: false
      }
    },

    created() {},

    methods: {}
  }
</script>
<style lang="less">
  .gray-box{
    display: block;
    width: 100vw;
    height: .5rem;
    background: #EFEEF0;
  }
</style>
