<template>
  <Panel w_100="w-100">
    <div slot="header-left" class="w-100">
      <mu-select-field style="display:none" v-model="filter.time"
                       class="panel-title-select"
                       :labelFloat="true"
                       :underlineShow="false">
        <mu-menu-item value="month" title="当月拜访客户次数"></mu-menu-item>
        <mu-menu-item value="quarter" title="当季拜访客户次数"></mu-menu-item>
        <mu-menu-item value="year" title="当年拜访客户次数"></mu-menu-item>
      </mu-select-field>

      <tab :queryParms="filterData"></tab>
    </div>

    <div slot="header-right">
      <ButtonGroup slot="header-right">
        <ButtonBase @click="filter.switch='oppertunity'" size="min" class="active">商机</ButtonBase>
        <ButtonBase @click="filter.switch='contractOrder'" size="min">订单</ButtonBase>
      </ButtonGroup>
    </div>

    <dl>
      <dt> 拜访客户次数总计</dt>
      <dd>
        <Number :value="visit.count" unit="次"></Number>
        <!-- 比上月增长<AnimateNumber :value="visit.growth" unit="%"></AnimateNumber> -->
      </dd>
    </dl>

    <div>
      <Echart v-if="startCharts" :options="options" width="100%" height="65vw"></Echart>
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
        visit: {
          count: 0,
          growth: 75
        },
        //筛选tab
        filterData: {
          title: '拜访客户次数',
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
          switch: 'oppertunity'
        },

        // Echarts Options
        options: {
          title: {
            text: '',
            subtext: '次数',
            left: '10%'
          },
          color: ['rgba(59,124,236,0.2)', '#3B7CEC'],

          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            data: ['拜访次数', '订单数'],
            bottom: '0%',
            left: '30%',
            selectedMode:'multiple',
            selected:{
              '拜访次数':true,
              '订单数':true,
            }
            // show: false
          },
          xAxis: {
            scale: 1,
            type: 'category',
            name: 'x',
            splitLine: {show: false},
            data: [],
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              width: '20%'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
            // min:5
            // name: 'y'
            minInterval: 1,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitArea: {
              //分割区域
              show: true,
              interval: 'auto',
              areaStyle: {
                // color: 'rgba(155,155,155,1)'
              }
            }
          },
          // dataZoom: [
          //   {
          //     type: 'inside',
          //     orient: 'horizontal'
          //   }
          // ],
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: [0],
              show: true,
              zoomLock: false,
              zoomOnMouseWheel: false,
              orient: 'horizontal',
              moveOnMouseMove: true,
              start: 1,
              end: 20,
            },
          ],
          series: [
            {
              name: '拜访次数',
              type: 'line',
              data: []
            },
            {
              name: '订单数',
              type: 'line',
              data: []
            }
          ]
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

    watch: {
      filter: {
        handler(v, old) {
          this.init()
        },
        deep: true
      }
    },

    mounted() {
      setTimeout(() => {
        this.startCharts = true
      }, this.delay)
    },

    methods: {
      async init() {
        // this.lastmqy(this.filter.time)
        let [visit/*, dayVisit*/] = await this.$ajax.seine([
          this.$ajax.post('/api/dashboard/getVisitsByPrivilige', {
            timeType: this.filter.time,
            year: this.mqy.year,
            month: this.mqy.month,
            quarter: this.mqy.quarter,
            orderType: 0,
            completeType: this.filter.switch
          }),
          this.$ajax.post('/api/dashboard/getVisitListByPrivilige', {
            timeType: this.filter.time,
            year: this.mqy.year,
            month: this.mqy.month,
            quarter: this.mqy.quarter,
            orderType: 0,
            completeType: this.filter.switch
          })
        ])
        let data = visit.data
        // let daysData = dayVisit.data
        let {series, xAxis, legend} = this.options

        // debugger
        if (this.filter.switch === 'oppertunity') {
          legend.data = ['拜访次数', '商机数']
          series[1].name = '商机数'
        } else {
          legend.data = ['拜访次数', '订单数']
          series[1].name = '订单数'
        }
        let names = []
        let visitDatas = []
        let completeDatas = []
        let visitSum = 0

        data && data.forEach(data => {
          let name = data.userName
          let visitData = data.allSum
          let completeData = data.completeSum

          names.push(name)
          visitDatas.push(visitData)
          completeDatas.push(completeData)
          visitSum += visitData
        })
        this.visit.count = visitSum

        // daysData.forEach(data => {
        //   let name = data.userName
        //   let visitData = data.allSum
        //   let completeData = data.completeSum
        //   names.push(name)
        //   visitDatas.push(visitData)
        //   completeDatas.push(completeData)
        //   visitSum += visitData

        // })
        // debugger
        series[0].data = visitDatas
        series[1].data = completeDatas
        // Vue.set(series, 0, series[0])
        // Vue.set(series, 1, series[1])

        let numbersPerPage = 5
        let datas = [];

        for (let i = 0; i < names.length; i++) {
          datas[i] = {
            value: names[i].substr(0.4),
            textStyle: {width: '30%'}
          }
        }

        xAxis.data = datas
        this.options.dataZoom[0].end = numbersPerPage / Math.max(numbersPerPage, datas.length) * 100
      },
      lastmqy(dataType) {
        this.lmqy = this.mqy
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

  dl {
    color: #9B9B9B;
    dt {
      font-size: 1.6rem;
    }
    dd {
      font-size: 2.4rem;
      line-height: 4.5rem;
    }
  }
</style>
