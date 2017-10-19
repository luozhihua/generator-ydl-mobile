<template>
  <Panel w_100="w-100">
    <div slot="header-left" class="w-100">
      <mu-select-field style="display:none" v-model="filter.time" class="panel-title-select" :labelFloat="true"
                       :underlineShow="false">
        <mu-menu-item value="month" title="当月目标达成情况"></mu-menu-item>
        <mu-menu-item value="quarter" title="当季目标达成情况"></mu-menu-item>
        <mu-menu-item value="year" title="当年目标达成情况"></mu-menu-item>
      </mu-select-field>

      <tab :queryParms="filterData"></tab>

      <!--    <div class="panel-title-select" @click="toggle()">
           <p>目标达成情况</p>
         </div>
         <div class="menus-dialog" v-if="dialog">
           <span :class="isActive(1)" @click="setPresentType(1)" value="month">当月</span>
           <span :class="isActive(2)" @click="setPresentType(2)" value="quarter">当季</span>
           <span :class="isActive(3)" @click="setPresentType(3)" value="year">当年</span>
         </div> -->
    </div>
    <div slot="header-right">
      <ButtonGroup slot="header-right">
        <ButtonBase @click="filter.switch='qoq'" size="min" class="active">环比</ButtonBase>
        <ButtonBase @click="filter.switch='yoy'" size="min">同比</ButtonBase>
      </ButtonGroup>
    </div>
    <div class="row">
      <div class="col goal-text">
        <div>目标
          <Number type="currency:2" :value="data.target" :unit="countFormat.formateUnit"></Number>
        </div>
        <div>销售目标达成</div>
        <div class="big-text">
          <Number type="currency:2" :value="data.percent"></Number>
          <span>%</span>
        </div>
      </div>
      <div class="col" style="height: 40vw;">
        <Echart v-if="startCharts" :options="options" :click="echartClick" width="50vw" height="50vw"></Echart>
      </div>
    </div>

    <Penetrate v-show="goalDialog"
               @close="goalDialog=false"
               :params="getQueryParams"
    ></Penetrate>
  </Panel>
</template>
<script>
  import Penetrate from '../penetrate.vue'

  export default {

    components: {
      Penetrate
    },

    props: {
      delay: {type: Number, default: 300}
    },

    data() {
      let that = this;

      return {
        dialog: true,
        setType: '',

        goalDialog: false,
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
          target: 0,
          achieve: 0,
          percent: 0,
          compPercent: 0
        },
        //筛选tab
        filterData: {
          title: '目标达成情况',
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
          switch: 'qoq'
        },

        // Echarts Options
        options: {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%',
            show: false
          },
          series: [

            // 达成率
            {
              type: 'gauge',
              radius: document.documentElement.offsetWidth / 4,
              startAngle: 170,
              endAngle: 10,
              splitNumber: 6,
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  // 柱子的宽度
                  width: 30 / this.PIXEL_RATIO,

                  // 0.298是百分比的比例值（小数），还有对应两个颜色值
                  color: [
                    [0, '#3B7CEC'],
                    [1, 'rgba(59,124,236,0.2)']
                  ]
                }
              },
              pointer: {
                width: 2 / this.PIXEL_RATIO, // 指针的宽度
                length: '140%' // 指针长度，按照半圆半径的百分比
              },
              itemStyle: {
                normal: {
                  color: '#3B7CEC',
                  shadowBlur: 2,
                  shadowColor: 'rgba(0,0,0,0.2)',
                  shadowOffsetX: 2
                }
              },
              detail: {
                show: false
              },
              data: [{
                value: 0,
                name: ''
              }]
            },

            // 环比数据线
            {
              type: 'gauge',
              startAngle: 170,
              endAngle: 10,
              splitNumber: 6,
              splitLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  // 柱子的宽度
                  width: 30 / this.PIXEL_RATIO,

                  // 0.298是百分比的比例值（小数），还有对应两个颜色值
                  color: [
                    [1, 'rgba(0,0,0,0)']
                  ]
                }
              },
              pointer: {
                width: 0, // 指针的宽度
                length: '160%', // 指针长度，按照半圆半径的百分比
                color: 'red'
              },
              itemStyle: {
                normal: {
                  borderColor: 'rgba(0,0,0,0.2)',
                  borderWidth: 1,
                  borderType: 'dashed'
                }
              },
              detail: {
                show: false
              },
              data: [{
                value: 0,
                name: ''
              }]
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
        handler(v, old) {
          this.init()
        },
        deep: true
      }
    },

    computed: {
      getQueryParams() {
        return {
          unitType: '',
          hasChild: true,
          viewType: 0,
          dataType: this.filter.time,
          year: this.mqy.year,
          month: this.mqy.month,
          quarter: this.mqy.quarter
        }
      },
      getCompParams() {
        let params

        if (this.filter.switch === 'qoq') {
          params = {
            unitType: '',
            hasChild: true,
            viewType: 0,
            dataType: this.filter.time,
            year: this.lmqy.year,
            month: this.lmqy.month,
            quarter: this.lmqy.quarter
          }
        } else {
          params = {
            unitType: '',
            hasChild: true,
            viewType: 0,
            dataType: this.filter.time,
            year: this.mqy.year - 1,
            month: this.mqy.month,
            quarter: this.mqy.quarter
          }
        }

        return params
      }
    },

    methods: {

      async init() {
        this.lastmqy(this.filter.time)
        let url = '/api/dashboard/salesAchievementWithoutProd'
        let [{data}, compRes, unitRes] = await this.$ajax.seine([
          this.$ajax.get(url, {
            params: this.getQueryParams
          }),
          this.$ajax.get(url, {
            params: this.getCompParams
          }),
          this.$ajax.get('/api/enumItem/getFormatNumberEnum'),
        ])
        let unitData = unitRes.data || {}
        let compData = compRes.data || []
        let {series} = this.options
        let number
        let compNumber

        // debugger;
        this.countFormat.countRate = unitData.countRate
        this.countFormat.countUnit = unitData.countUnit
        this.countFormat.priceRate = unitData.priceRate
        this.countFormat.priceUnit = unitData.priceUnit

        if (data && data.length > 0) {

          if (data[0].unitType === 'price') {
            this.countFormat.formateRate = unitData.priceRate
            this.countFormat.formateUnit = unitData.priceUnit
          } else {
            this.countFormat.formateRate = unitData.countRate
            this.countFormat.formateUnit = unitData.countUnit
          }

          this.data.target = (data[0].target / this.countFormat.formateRate) || 0
          this.data.achieve = data[0].complete
          number = data[0].complete / data[0].target * 100
        }

        number = (isNaN(number) || (window.Infinity && number === window.Infinity)) ? 0 : number

        compNumber = compData[0].complete / compData[0].target * 100
        compNumber = (isNaN(compNumber) || (window.Infinity && compNumber === window.Infinity)) ? 0 : compNumber

        this.data.percent = number
        this.data.compPercent = compNumber

        series[0].data[0].value = number
        series[0].axisLine.lineStyle.color[0][0] = number / 100

        series[1].data[0].value = compNumber
        // 单位存起来
        this.$storage.setItem('unitFormat', this.countFormat);
      },

      echartClick(params) {
        this.goalDialog = true
      },

      toggle: function () {
        if (this.dialog === false) {
          this.dialog = true;
        } else {
          this.dialog = false;
        }
      },

      isActive(type) {
        return {
          active: (this.setType === type)
        }
      },

      setPresentType(type, text) {
        this.setType = type
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

<style lang="less">
  @import url('../../../styles/vars.less');

  .mu-dropDown-menu-text-overflow {
    overflow: visible;
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
    .menus-dialog {
      display: flex;
      justify-content: space-around;
      span {
        width: 100%;
        color: #999;
        display: inline-block;
        padding: 1rem 3.6rem;
        background-color: #fff;
        border-radius: 1rem;
        &.active {
          background: rgba(134, 178, 255, 0.22);
          color: #3b7cec;
        }
      }
    }

    .goal-details-dialog {

      border-radius: 1rem;
      overflow: hidden;
      background-color: #f5f5f5;

      .mu-dialog-title {
        padding: .5rem 1.2rem;
        font-size: 1.2rem;
        background-color: @color-primary;
        display: flex;
        color: #fff;
      }
    }
  }

  .goal-text {
    color: #9b9b9b;
    line-height: 2.2rem;

    div:nth-child(1) {
      font-size: 1.3rem;
    }
    div:nth-child(2) {
      font-size: 1.6rem;
    }
    div:nth-child(3) {
      font-size: 5rem;
      margin-top: 3rem;
      span:nth-child(2) {
        font-size: 2rem;
      }
    }
  }
</style>
