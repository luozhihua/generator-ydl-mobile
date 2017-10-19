<template>
  <Panel w_100="w-100">

    <div slot="header-left" class="w-100">
      <mu-select-field style="display:none" v-model="filter.time"
                       class="panel-title-select"
                       :labelFloat="true"
                       :underlineShow="false">
        <mu-menu-item value="month" title="当月销售漏斗"></mu-menu-item>
        <mu-menu-item value="quater" title="当季销售漏斗"></mu-menu-item>
        <mu-menu-item value="year" title="当年销售漏斗"></mu-menu-item>
      </mu-select-field>
      <tab :queryParms="filterData"></tab>
    </div>

    <div slot="header-right">
      <!-- <ButtonGroup slot="header-right">
        <ButtonBase @click="filter.switch='project'" size="min">数量</ButtonBase>
        <ButtonBase @click="filter.switch='price'" size="min" class="active">金额</ButtonBase>
      </ButtonGroup> -->
    </div>

    <div class="row">
      <div class="chart-funnel">
        <Echart v-if="startCharts" :options="options" width="60vw" height="44vw"></Echart>
      </div>
      <div class="col">
        <p>{{showDays[filter.time]}}可能赢单总额</p>
        <Number :value="data.willWin" class="big-text" :unit="countFormat.priceUnit" type="number:2"></Number>
        <p>
          赢单
          <Number v-if="filter.switch=='price'" :value="data.win" :unit="countFormat.priceUnit"
                  type="number:2"></Number>
          <Number type="currency:2" v-if="filter.switch=='project'" :value="data.win" unit="个商机"></Number>
        </p>
        <p>
          合同
          <Number v-if="filter.switch=='price'" :value="data.complete" :unit="countFormat.priceUnit"
                  type="number:2"></Number>
          <!-- <Number type="currency:2" v-if="filter.switch=='project'" :value="data.win" unit="个商机"></Number> -->
        </p>
      </div>
    </div>
  </Panel>
</template>

<script>
  export default {
    NAME: ['SalesFunnel'],
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
        // 统计单位
        countFormat: {
          countRate: 1,
          countUnit: '个',
          priceRate: 1,
          priceUnit: '元',
          formateRate: 1,
          formateUnit: '元',
          unit: 'price'
        },

        data: {
          forcast: 0,
          win: 0,
          business: 0,
          complete: 0,
          willWin: 0
        },
        showDays: {
          year: '当年',
          month: '当月',
          quarter: '当季'
        },
        //筛选tab
        filterData: {
          title: '销售漏斗',
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
          switch: 'price'
        },

        // Echarts Options
        options: {
          color: ['rgba(59,124,236,0.2)', '#3B7CEC'],
          tooltip: {
            show: false,
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
          },
          series: [
            {
              name: '漏斗图',
              type: 'visualFunnel',
              top: '2%',
              bottom: '2%',
              left: '2%',
              right: '26%',
              neckWidth: '20%',
              neckStart: '60%',
              sort: 'ascending', // ascending, descending
              label: {
                normal: {
                  show: true,
                  position: 'right',
                  formatter: (params) => {
                    let label

                    if (this.filter.switch === 'project') {
                      label = (params.data.count || 0).toFixed(2) + this.countFormat.countUnit;
                    } else {
                      label = (params.data.count || 0).toFixed(2) + this.countFormat.priceUnit;
                    }

                    return label
                  }
                },
                emphasis: {
                  position: 'left',
                  formatter: (params) => {
                    let label

                    if (this.filter.switch === 'project') {
                      label = (params.data.count || 0).toFixed(2) + this.countFormat.countUnit;
                    } else {
                      label = (params.data.count || 0).toFixed(2) + this.countFormat.priceUnit;
                    }

                    return label
                  }
                }
              },
              data: [
                // {value: 123, name: '123'},
                // {value: 0, name: ''},
                // {value: 0, name: ''}
              ]
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

    mounted() {
      setTimeout(() => {
        this.startCharts = true
      }, this.delay)
    },

    watch: {
      filter: {
        handler() {
          this.init()
        },
        deep: true
      }
    },

    methods: {

      async init() {
        // debugger;
        let funelUrl = this.filter.switch === 'project' ?
          '/api/order/queryStagesCountStatistic' :
          '/api/order/queryChanceStagesStatistic'

        let [funels, forcast, unitRes, completeRes] = await this.$ajax.seine([
          this.$ajax.get(funelUrl, {
            params: {
              dataType: this.filter.time,
              year: this.mqy.year,
              quarter: this.mqy.quarter,
              month: this.mqy.month,
              sortType: 0,
              isOrder: 1,
              status: 100,
              managerCodes: '',
              isUser: 0,
              withChild: true,
              productCodes: ''
            }
          }),

          this.$ajax.get('/api/order/querySubManagerChanceStatistic', {
            params: {
              dataType: this.filter.time,
              year: this.mqy.year,
              quarter: this.mqy.quarter,
              month: this.mqy.month,
              sortType: 0,
              isOrder: 1,
              status: 100,
              managerCodes: '',
              isUser: 0,
              withChild: true,
              productCodes: '',
              unitType: 'price'
            }
          }),
          this.$ajax.get('/api/enumItem/getFormatNumberEnum'),
          this.$ajax.get('/api/dashboard/salesAchievementWithoutProd', {
            params: {
              unitType: '',
              hasChild: true,
              viewType: 0,
              dataType: this.filter.time,
              year: this.mqy.year,
              quarter: this.mqy.quarter,
              month: this.mqy.month
            }
          })
        ])

        let unitData = unitRes.data || {}
        let completeData = completeRes.data || []

        // debugger;
        this.countFormat.countRate = unitData.countRate
        this.countFormat.countUnit = unitData.countUnit
        this.countFormat.priceRate = unitData.priceRate
        this.countFormat.priceUnit = unitData.priceUnit

        let data = funels.data || []
        let {series} = this.options
        let funelDatas = []

        // debugger

        data && data.forEach(data => {
          // 不要输单
          if (data.stage.key !== -7) {
            let funelData = {}

            funelData.value = data.stage.index
            funelData.name = data.stage.name
            funelData.unit = this.countFormat.priceUnit

            if (this.filter.switch === 'project') {
              funelData.count = data.statistic.productCount
            } else {
              funelData.count = data.statistic.realPriceFormat
            }
            funelDatas.push(funelData)
          }
        })

        data && data.forEach(data => {
          // 不要输单和赢单
          // debugger
          if (data.stage.key !== -7 && data.stage.key !== 7) {

            if (this.filter.switch === 'project') {
              this.data.willWin += data.statistic.productCount
            } else {
              this.data.willWin += data.statistic.realPriceFormat
            }
          }
        })

        // debugger;
        if (this.filter.switch === 'project') {
          this.data.win = data[data.length - 1].statistic.productCount
          this.data.forcast = forcast.data ? forcast.data[0].productCountFormat : 0
          this.data.complete = completeData[0].complete / this.countFormat.countRate || 0
        } else {
          this.data.win = data[data.length - 1].statistic.realPriceFormat
          this.data.forcast = forcast.data ? forcast.data[0].realPriceFormat : 0
          this.data.complete = completeData[0].complete / this.countFormat.priceRate || 0
        }
        // 更新漏斗图数据
        // series[0].data.forEach(data=>{
        //   data.value = Math.floor(Math.random() * 1000)
        // })
        // debugger;
        // Array.reverse(funelDatas)
        series[0].data = funelDatas

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

  .col {
    font-family: PingFangSC-Regular;
    font-size: 1.4rem;
    color: #9B9B9B;
    width: 30vw;

    .big-text {
      font-family: Roboto-Regular;
      font-size: 2.4rem;
      color: #9B9B9B;
      line-height: 4.5rem;
    }
  }
</style>
