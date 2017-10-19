<template>
  <Panel w_100="w-100">
    <div slot="header-left" class="w-100">
      <mu-select-field style="display:none" v-model="filter.time"
                       class="panel-title-select"
                       :labelFloat="true"
                       :underlineShow="false">
        <mu-menu-item value="month" title="当月销售业绩排行榜"></mu-menu-item>
        <mu-menu-item value="quarter" title="当季销售业绩排行榜"></mu-menu-item>
        <mu-menu-item value="year" title="当年销售业绩排行榜"></mu-menu-item>
      </mu-select-field>

      <tab :queryParms="filterData"></tab>
    </div>

    <div slot="header-right">
      <ButtonGroup slot="header-right">
        <ButtonBase  @click="filter.switch='personal'" size="min" class="active">个人</ButtonBase>
        <ButtonBase v-if="isManager" @click="filter.switch='team'" size="min">团队</ButtonBase>
      </ButtonGroup>
    </div>

    <div class="chart-wrapper">
      <a href="javascript: void(0);" @click="toggleMoreData" class="show-more">
        <span v-if="!shownMore">展开</span>
        <span v-else>收起</span>
      </a>
      <Echart ref="echart" v-if="startCharts" :options="options" width="100%" :height="chartHeight"></Echart>
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
        isManager: true,
        startCharts: false,

        chartHeight: '70vw',

        // 月/季/年
        mqy: {
          year: 2017,
          month: 1,
          quarter: 1
        },

        //筛选tab
        filterData: {
          title: '销售业绩排行榜',
          data: [
            {name: '当月', key: 'month'},
            {name: '当季', key: 'quarter'},
            {name: '当年', key: 'year'}
          ],
          selectCallback(data) {

            that.filter.time = data.key
          }
        },

        // Chart 筛选条件
        filter: {
          time: 'month',
          switch: 'personal'
        },

        shownMore: false,

        // Echarts Options
        options: {
          color: ['rgba(59,124,236,0.2)', '#3B7CEC'],
          grid: {
            left: 70,
            top: 0
          },
          legend: {
            data: ['销售目标', '完成业绩'],
            bottom: '3%',
            left: '25%',
            show: true
          },
          xAxis: {
            show: false,
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {color: '#ccc'}
            },
            axisLabel: {
              textStyle: {color: '#777'}
            }
          },
          yAxis: {
            name: '',
            splitLine: {
              show: false
            },
            nameLocation: 'start',
            nameTextStyle: {
              fontWeight: 'bold'
            },
            position: 'left',
            offset: 70,
            axisLine: {
              onZero: false,
              show: false
            },
            axisLabel: {
              inside: true
            },
            inverse: true,
            data: [],

          },
          dataZoom: [
            {
              yAxisIndex: 0,
              type: 'inside',
              zoomLock: true,
              zoomOnMouseWheel: false,
              moveOnMouseMove: true,
              start: 0,
              end: 60,
            },
          ],
          series: [{
            name: '销售目标',
            type: 'bar',
            data: [],
            barWidth: 15,
            barMaxWidth: 20 / this.PIXEL_RATIO
            // itemStyle: {
            //   normal: {
            //     color: '#EBEBEB'

            //   },
            //   emphasis: {
            //     color: '#E7EEFC'
            //   }
            // }
          }, {
            name: '完成业绩',
            type: 'bar',
            data: [],
            barWidth: 15,
            barMaxWidth: 20 / this.PIXEL_RATIO,
            // itemStyle: {
            //   normal: {
            //     color: '#CDCCCD'
            //   },
            //   emphasis: {
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
      this.isManager = this.$storage.getItem('isManager') !== 'false'

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
      },

      shownMore(value) {
        let data = this.options.series[0].data || []
        let dataLength = data.length
        let height

        if (value) {
          height = Math.max(4, dataLength) * 6
          this.options.dataZoom[0].end = 100
        } else {
          height = 24
          this.options.dataZoom[0].end = 60
        }

        this.chartHeight = `${height}rem`

        setTimeout(()=>{
          this.$refs.echart.chart.resize()
        }, 30)
      }
    },

    methods: {

      async init() {
        let url = this.filter.switch === 'team' ?
          '/api/dashboard/depsAchievement' :
          '/api/dashboard/salesCompleteList'
        let params = {
          unitType: 'price',
          hasChild: false,
          viewType: 0,
          dataType: this.filter.time,
          year: this.mqy.year,
          month: this.mqy.month,
          quarter: this.mqy.quarter,
          orderType: 1
        }
        let {data} = await this.$ajax.post(url, params)
        let {series} = this.options
        let {yAxis} = this.options
        let numbersPerPage = 4
        let list = [],
          list1 = [],
          names = []

        data && data.forEach(data => {
          list1.push(data.complete)
          list.push(data.target)
          names.push(data.name)
        })

        series[0].data = list
        series[1].data = list1
        yAxis.data = names

        this.options.dataZoom[0].end = numbersPerPage / Math.max(numbersPerPage, names.length) * 100
      },

      /**
       * 展开
       */
      toggleMoreData() {
        this.shownMore = !this.shownMore
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../styles/vars";

  .chart-wrapper {
    position: relative;

    .show-more {
      position: absolute;
      z-index: 1;
      right: 0;
      top: 0;
      color: @color-primary;
      display: inline-block;
      padding: 1rem;
    }
  }

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
