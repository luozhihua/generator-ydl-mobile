<template>
  <Page title="筛选器示例">

    <Panel>
      <h1 slot="header-left">筛选器示例</h1>

      <mu-raised-button @click="showFilter=!showFilter" label="显示过滤器" :primary="true"/>

      <FilterPanel
        v-model="filter"
        :show="showFilter"
        :options="filterOptions"
        @open="showFilter=true"
        @close="showFilter=false"></FilterPanel>
    </Panel>

    <pre>{{filter}}</pre>

  </Page>
</template>

<script>
  export default {
    /**
     * 默认数据
     */
    data: function () {
      return {
        showFilter: false,
        filter: {},
        filterOptions: [
          {
            title: '负责人',
            key: 'empl',
            type: 'employee', // 人员选择(employee),  部门选择（department）
            default: '',
            list: [
              {key: '金明', value: 'dingId-1'},
              {key: '罗志华', value: 'dingId-2'}
            ]
          }, {
            title: '部门',
            key: 'department',
            type: 'department', // 人员选择(employee),  部门选择（department）
            default: '',
            list: [
              {key: '产品部', value: 'dep-1'},
              {key: '研发部', value: 'dep-2'}
            ]
          }, {
            title: '交货日期',
            key: 'deliveryDate',
            type: 'dateange', // 时间范围
            multipe: true,
            default: ['currentQ'],
            list: [
              {key: '本周', value: 'currentWeek'},
              {key: '本月', value: 'currentMonth'},
              {key: '本季度', value: 'currentQ'},
              {key: '今天', value: 'today'},
              {key: '昨天', value: 'yesterday'}
            ]
          }, {
            title: '合同金额',
            key: 'contractAmount',
            type: 'numberRange', // 数字范围
            categories: [
              {key: '千级', value: [1, 999]},
              {key: '千级', value: [1000, 9999]},
              {key: '万级', value: [10000, 99999]},
              {key: '十万级', value: [100000, 999999]},
              {key: '百万级', value: [1000000, 9999999]}
            ],
            default: [1000, 9999]
          }, {
            title: '订单状态',
            key: 'orderStatus',
            type: 'normal', // 普通选项
            list: [
              {key: '不限', value: 'all'},
              {key: '已生效', value: '1'},
              {key: '未生效', value: '2'},
              {key: '已完成', value: '3'}
            ],
            default: 'all'
          }
        ],

        /**
         * 顶部右侧钉钉自定义菜单
         */
        dingMenus: [
          {
            id: '0',
            iconId: 'setting',
            text: 'New',
            onClick: () => {
              this.showFilter = !this.showFilter
            }
          }
        ]
      }
    },

    /**
     * 组件初始化钩子
     */
    async created () {
      this.init()
    },

    watch: {
      filter: {
        handler() {
          // this.$ajax.get('url.json', {params: this.filter})
        },
        deep: true
      }
    },

    /**
     * 当前页面能调用的方法
     */
    methods: {
      init () {
        try {
          console.log(this.getCorpId())
        } catch (e) {
          alert(e.message)
        }
      }
    }
  }
</script>

<style lang="less" scoped>

  h1 {
    color: red;
  }
  pre {
    border: 1px solid #eee;
    border-radius: 1rem;
    padding: 1rem;
    background-color: #eee;
    margin: 1rem 1rem 3rem;
  }
</style>
