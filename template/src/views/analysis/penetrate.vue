<template>
  <!-- 弹框 -->
  <transition name="penetrate">
    <div class="penetrate-mask" v-domportal="true">
      <transition name="penetrate">
        <Panel v-if="delayShow" class="penetrate">
          <header slot="header-left">目标达成情况</header>
          <header slot="header-right">
            <mu-icon-button @click="$emit('close')">
              <i class="yd-icon yd-guanbijiantou"></i>
            </mu-icon-button>
          </header>

          <div class="penetrate-body">
            <ul class="selector-list">
              <li v-for="cond in filters" :key="cond.key">
                <ProductSelector v-if="cond.type==='product'"
                                 v-model="model[cond.key]"
                                 :options="{selected: model[cond.key]}">
                  <i class="yd-icon yd-grid"></i> 选择产品
                </ProductSelector>

                <OrgSelector v-if="cond.type==='department'"
                             v-model="model[cond.key]"
                             :type="'organization'"
                             :options="{}"
                             :multipe="true"
                             :max="100"
                             :selectedDepartments="model[cond.key]"
                             :requiredDepartments="[]"
                             :disabledDepartments="[]"
                             :selectedUsers="[]"
                             :requiredUsers="[]"
                             :disabledUsers="[]">
                  <i class="yd-icon yd-user"></i> 选择部门
                </OrgSelector>

              </li>
            </ul>

            <div class="slots">
              <Echart :options="defaultOptions" width="100vw" height="90vw"></Echart>
            </div>
          </div>
        </Panel>
      </transition>
    </div>
  </transition>
</template>

<script>
  import {isFunction} from 'lodash'

  export default {
    props: {
      avilableFilters: {type: Array},
      options: {type: Object},
      params: {type: Object}
    },

    data() {
      return {
        delayShow: false,

        model: {
          product: [],
          department: [],
          statisticalType: '2'
        },

        builtInFilters: [
          {key: 'product', value: '', type: 'product'},
          {key: 'department', value: '', type: 'department'},
          {key: 'statisticalType', value: '', type: 'statistical'}
        ],

        filter: {},

        defaultOptions: {
          title: {
            text: '',
            subtext: '达成率',
            left: '10%',
            top: '-10%'
          },
          color: ['rgba(59,124,236,0.2)', '#3B7CEC'],
          grid: {
            top: '12%'
          },
          /*
           legend: {
           left: 'left',
           data: ['环比', '当前'],
           bottom: '0%'
           },
           */
          xAxis: {
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {color: '#ccc'}
            },
            axisLabel: {
              textStyle: {color: '#777'}
            },
            axisTick: {
              show: false
            },
            inverse: true,
            data: []
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
            barMaxWidth: 16 / this.PIXEL_RATIO
          }, {
            type: 'bar',
            name: '当前',
            data: [0, 0, 0],
            barMaxWidth: 16 / this.PIXEL_RATIO
          }]
        }
      }
    },

    mounted() {
      this.load()
      setTimeout(() => {
        this.delayShow = true
      }, 300)
    },

    computed: {
      filters() {
        return this.builtInFilters.concat(this.avilableFilters || [])
      },

      queryParams() {
        let userOrgs = []
        let products = []

        this.model.department.forEach((depart) => {
          userOrgs.push(depart.id)
        })

        this.model.product.forEach((prod) => {
          products.push(prod.id)
        })

        return {
          ... this.params,
          ids: userOrgs.join(','), // 人or部门的ID
          productIds: products.join(',') // 产品ID，可多选
        }
      }
    },

    watch: {
      model: {
        handler() {
          this.onChanged()
        },
        deep: true
      }
    },

    methods: {

      close() {
        this.$emit('close')
      },

      onChanged() {
        let model = JSON.parse(JSON.stringify(this.model))

        this.load()
        this.$emit('input', model)
      },

      /**
       * 执行对应的 Action
       * @param condition
       */
      async doAction(condition) {
        let result, type, action

        if (isFunction(condition.action)) {
          result = await condition.action.apply(this, [condition])
        } else {
          type = condition.type
          action = this[`${type}Action`]

          if (isFunction(action)) {
            result = await action.apply(this, [condition])
          }
        }

        if (result) {
          this.model[condition.key] = result
        }
      },

      async load() {
        let url = '/api/dashboard/salesAchievement'
        let {data} = await this.$ajax.get(url, {params: this.queryParams})

        if (data) {
          let data1 = [] // 达成率
          let data2 = [] // 环比达成率
          let teams = []

          data.forEach(team => {
            teams.push(team.name)
            data1.push(team.percent)
            data2.push(team.complete)
          })

          this.defaultOptions.xAxis.data = teams
          this.defaultOptions.series[0].data = data1
          this.defaultOptions.series[1].data = data2
        }
      }
    }
  }
</script>

<style lang="less">

  .penetrate-mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 11111;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);

    .penetrate {
      width: 90vw;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
      border-radius: 1rem;
      overflow: hidden;
      background-color: #f5f5f5;

      .js-panel-header {
        padding: .3rem 1.2rem;
        font-size: 1.2rem;
        background-color: @color-primary;
        display: flex;

        .col {
          color: #fff !important;
        }
      }

      .selector-list {
        padding-bottom: 1rem;
        display: flex;
        flex-wrap: wrap;

        li {
          background-color: #888;
          color: #fff;
          display: inline-block;
          padding: .2rem 1rem;
          margin-right: 1rem;
          border-radius: .2rem;

          .yd-icon {
            font-size: 1.6rem;
          }
        }
      }

      .penetrate-body {
        max-height: 70vh;
        overflow: auto;
      }
    }
  }

  .selector-list {
    .yd-select {
      background-color: red;
    }
  }

  /* Animations */
  .penetrate-enter-active {
    animation: penetrate-in .3s;
    animation-timing-function: cubic-bezier(.5, 0, .5, 1);
    z-index: 1;
  }

  .penetrate-leave-active {
    animation: penetrate-out .35s;
    animation-timing-function: cubic-bezier(.5, 0, .5, 1);
  }

  @keyframes penetrate-in {
    0% {
      transform: translate(100%);
      /*transform: translate3d(50px, 50px, 37px) scale(0.1) rotate3d(3.4,9.5,3,100deg);*/
    }
    100% {
      transform: translate(0);
    }
  }

  @keyframes penetrate-out {
    0% {
      transform: translate(0);
    }
    100% {
      transform: translate(0, -100%) scale(0.8);
    }
  }
</style>
