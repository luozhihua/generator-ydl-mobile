<template>
  <Panel w_100="w-100">
    <div slot="header-left" class="w-100">
      <mu-select-field style="display:none" v-model="filter.time"
                       class="panel-title-select"
                       :labelFloat="true"
                       :underlineShow="false">
        <mu-menu-item value="month" title="当月新增"></mu-menu-item>
        <mu-menu-item value="quarter" title="当季新增"></mu-menu-item>
        <mu-menu-item value="year" title="当年新增"></mu-menu-item>
      </mu-select-field>

      <tab :queryParms="filterData"></tab>
    </div>

    <div slot="header-right">
      <!-- <ButtonGroup slot="header-right">
        <Button @click="filter.switch='yoy'" size="min">同比</Button>
        <Button @click="filter.switch='qoq'" size="min" class="active">环比</Button>
      </ButtonGroup> -->
    </div>

    <div>
      <Echart v-if="startCharts" :options="options" width="100%" height="78vw"></Echart>
    </div>
  </Panel>
</template>

<script>
  export default {
    props: {
      delay: {type: Number, default: 300}
    },

    data() {
      let that = this;

      return {

        startCharts: false,

        // 月/季/年
        mqy: {
          year: 2017,
          month: 1,
          quarter: 1
        },
        // 上月/季/年
        lmqy: {
          year: 2017,
          month: 1,
          quarter: 1
        },
        //筛选tab
        filterData: {
          title: '新增',
          data: [
            {name: '当月', key: 'month'},
            {name: '当季', key: 'quarter'},
            {name: '当年', key: 'year'},
          ],
          selectCallback(data) {

            that.filter.time = data.key
          }
        },
        // Chart 筛选条件
        filter: {
          time: 'month',
          switch: 'yoy'
        },

        // Echarts Options
        options: {
          title: {
            text: '',
            subtext: '个数',
            left: '10%',
            top: '-10%',
          },
          color: ['rgba(59,124,236,0.2)', '#3B7CEC'],
          grid: {
            top: '12%'
          },
          legend: {
            data: ['环比', '当前'],
            bottom: '0%',
            left: '30%'
            // show: false
          },
          xAxis: {
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {color: '#ccc'}
            },
            axisLabel: {
              textStyle: {color: '#777'},
              interval: 0
            },
            axisTick: {
              show: false
            },
            inverse: true,
            data: ['阶段变更的商机', '商机', '客户', '订单']
          },
          yAxis: {
            name: '',
            splitLine: {
              show: true
            },
            nameTextStyle: {
              fontWeight: 'bold'
            },
            axisLine: {
              onZero: false,
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            type: 'bar',
            name: '环比',
            data: [0, 0, 0],
            barGap: 0,
            barCategoryGap: 20,
            barMaxWidth: 16 / this.PIXEL_RATIO,
            // itemStyle: {
            //   normal: {
            //     color: '#E7EEFC'

            //   }
            // }
          }, {
            type: 'bar',
            name: '当前',
            data: [0, 0, 0],
            barMaxWidth: 16 / this.PIXEL_RATIO,
            // itemStyle: {
            //   normal: {
            //     color: 'rgba(54, 81, 162, 0.5)'
            //   }
            // }
          }]
        }
      }
    },

    created() {
      let now = new Date()

      this.mqy.year = now.getFullYear()
      this.mqy.month = now.getMonth() + 1
      this.mqy.quarter = Math.floor(now.getMonth() / 3 + 1)
      this.init()
    },

    mounted() {
      setTimeout(() => {
        this.startCharts = true
      }, this.delay)
    },

    watch: {
      filter: {
        handler(v, old) {
          this.init()
        },
        deep: true
      }
    },

    methods: {
      async init() {
        this.lastmqy(this.filter.time);

        let [oppertunity,
          customer,
          order,
          changeOrder,
          loppertunity,
          lcustomer,
          lorder,
          lchangeOrder
        ] = await this.$ajax.seine([
          this.$ajax.post('/api/dashboard/countNewOppertunity', {
            dataType: this.filter.time,
            year: this.mqy.year,
            quarter: this.mqy.quarter,
            month: this.mqy.month,
            hasChild: 1
          }),
          this.$ajax.post('/api/dashboard/countNewCustomer', {
            dataType: this.filter.time,
            year: this.mqy.year,
            quarter: this.mqy.quarter,
            month: this.mqy.month,
            hasChild: 1
          }), // 404, b === null
          this.$ajax.post('/api/dashboard/contractCount', {
            dateType: this.filter.time,
            year: this.mqy.year,
            quarter: this.mqy.quarter,
            month: this.mqy.month,
            hasChild: 1
          }),
          this.$ajax.post('/api/dashboard/countOppertunityChange', {
            dataType: this.filter.time,
            year: this.mqy.year,
            quarter: this.mqy.quarter,
            month: this.mqy.month,
            hasChild: 1
          }),
          this.$ajax.post('/api/dashboard/countNewOppertunity', {
            dataType: this.filter.time,
            year: this.lmqy.year,
            quarter: this.lmqy.quarter,
            month: this.lmqy.month,
            hasChild: 1
          }),
          this.$ajax.post('/api/dashboard/countNewCustomer', {
            dataType: this.filter.time,
            year: this.lmqy.year,
            quarter: this.lmqy.quarter,
            month: this.lmqy.month,
            hasChild: 1
          }), // 404, b === null
          this.$ajax.post('/api/dashboard/contractCount', {
            dateType: this.filter.time,
            year: this.lmqy.year,
            quarter: this.lmqy.quarter,
            month: this.lmqy.month,
            hasChild: 1
          }),
          this.$ajax.post('/api/dashboard/countOppertunityChange', {
            dataType: this.filter.time,
            year: this.lmqy.year,
            quarter: this.lmqy.quarter,
            month: this.lmqy.month,
            hasChild: 1
          })
        ])
        // debugger;
        // let url = '/vue/data.json'
        // let params = {}
        // let {data} = await this.$ajax.get(url, {params: params})
        let {series, legend} = this.options

        if (this.filter.time === 'month') {
          legend.data = ['上月', '当月']
          series[0].name = '上月'
          series[1].name = '当月'
        } else if (this.filter.time === 'quarter') {
          legend.data = ['上季', '当季']
          series[0].name = '上季'
          series[1].name = '当季'
        } else if (this.filter.time === 'year') {
          legend.data = ['上年', '当年']
          series[0].name = '上年'
          series[1].name = '当年'
        }

        // console.log(data) // 服务器返回的数据
        let list = [], list1 = []

        list.push(changeOrder.data)
        list.push(oppertunity.data)
        list.push(customer.data)
        list.push(order.data)

        list1.push(lchangeOrder.data)
        list1.push(loppertunity.data)
        list1.push(lcustomer.data)
        list1.push(lorder.data)

        // while (list.length < 5) {
        //   list.push(Math.floor(Math.random() * 1000))
        //   list1.push(Math.floor(Math.random() * 1000))
        // }

        series[0].data = list1
        series[1].data = list
      },

      lastmqy(dataType) {
        this.lmqy = Object.assign({}, this.mqy)
        if (dataType === 'year') {
          this.lmqy.year--
        } else if (dataType === 'month') {
          if (this.lmqy.month > 1) {
            this.lmqy.month--
          } else {
            this.lmqy.month = 12
            this.lmqy.year--
          }
        } else {
          if (this.lmqy.quarter > 1) {
            this.lmqy.quarter--
          } else {
            this.lmqy.quarter = 4
            this.lmqy.year--
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped="">

  .panel-title-select {
    min-height: inherit;
    margin-bottom: 0;
    width: auto;
    min-width: 10rem;

    .mu-dropDown-menu {
      font-size: 1.5rem;
      color: #747474;
      font-weight: 500;
    }

    .mu-text-field-content {
      padding-bottom: 0;
    }
  }
</style>
