<template>
  <div class="js-filter-panel">

    <!--已选的筛选条件-->
    <div class="filter-condition" v-if="showConditions">
      <span @click="$emit('open')"
            :key="value"
            v-for="(value, key) in model"
            v-if="!isDefaultValue(key, value)"
      >
        {{ getLabel(key, value) }}
        <i class="icon delete" @click="resetItem($event, key)"></i>
      </span>
    </div>

    <!--筛选器面板-->
    <transition name="js-filter">
      <Page v-show="show" :class="className" has-footer ref="pannels" :has-ding-menu="false">
        <div class="pannels">
          <Panel v-if="section.disabled != true " v-for="(section, i) in options" :key="section.type">
            <div slot="header-left">{{section.title}}</div>

            <!--选项分类-->
            <div v-if="section.categories" slot="header-right" class="number-range-select">
            <span v-for="cate in section.categories" :key="cate.key">
              <mu-flat-button class="btn-category" @click="selectCate(section, cate)" :label="cate.key"
                              :primary="cate.current"/>
            </span>
            </div>

            <div>
              <!-- 普通选项 -->
              <div v-if="section.type!=='numberRange'">
                <span v-for="item in section.list" :key="item.key">

                  <mu-flat-button class="btn-check" @click="check(section, item)" :label="item.key"
                                  :primary="isChecked(section, item)"/>
                  <!--<mu-raised-button @click="check(section, item)" :label="item.key" :primary="isChecked(section, item)"/>-->
                </span>

                <!--选人或选部门-->
                <span class="btn-add-option" v-if="section.type==='employee' || section.type==='department'">
                  <OrgSelector
                    v-model="section.list"
                    @input="onOrgChange(section)"
                    :multipe="!!section.multipe"
                    :type="section.type"
                    :selectedUsers="getKeys(section.list)"
                    :selectedDepartments="getKeys(section.list)"
                    :formatter="orgUserFormatter">
                    <mu-flat-button multipe primary>
                      <i class="yd-icon yd-jiahao1"></i>
                    </mu-flat-button>
                  </OrgSelector>
                </span>
              </div>

              <!-- 数字区间 -->
              <div v-if="section.type==='numberRange'" class="number-range">
                <Slider v-model="model[section.key]"
                        :min="getCurrentCate(section).value[0]"
                        :max="getCurrentCate(section).value[1]"></Slider>
              </div>
            </div>
          </Panel>

        </div>

        <div class="btn-group" slot="footer">
          <mu-raised-button @click="reset()" label="重置"></mu-raised-button>
          <mu-raised-button @click="done()" label="确认完成" primary=""></mu-raised-button>
        </div>
      </Page>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Backbutton from '../../utils/backbutton'
  import Slider from 'vue-slider-component'
  import {union, find, filter, groupBy, isArray, isUndefined} from 'lodash'

  export default {
    NAME: 'FilterPanel',

    components: {
      Slider
    },

    props: {
      show: {type: Boolean, default: false},
      showConditions: {type: Boolean, default: true},
      options: {
        type: [Array], default: () => {
          return []

          //          return [
          //            {
          //              title: '负责人',
          //              key: 'empl',
          //              type: 'employee', // 人员选择(employee),  部门选择（department）
          //              default: '',
          //              list: []
          //            }, {
          //              title: '交货日期',
          //              key: 'deliveryDate',
          //              type: 'dateange', // 时间范围
          //              multipe: true,
          //              default: '',
          //              list: [
          //                {key: '本周', value: 'currentWeek'},
          //                {key: '本月', value: 'currentMonth'},
          //                {key: '本季度', value: 'currentQ'},
          //                {key: '今天', value: 'today'},
          //                {key: '昨天', value: 'yestoday'}
          //              ]
          //            }, {
          //              title: '合同金额',
          //              key: 'contractAmount',
          //              type: 'numberRange', // 数字范围
          //              categories: [
          //                {key: '千级', value: [0, 999]},
          //                {key: '千级', value: [1000, 9999]},
          //                {key: '万级', value: [10000, 99999]},
          //                {key: '十万级', value: [100000, 999999]},
          //                {key: '百万级', value: [1000000, 9999999]}
          //              ],
          //              default: [1000, 9999]
          //            }, {
          //              title: '订单状态',
          //              key: 'orderStatus',
          //              type: 'normal', // 普通选项
          //              list: [
          //                {key: '不限', value: 'all'},
          //                {key: '已生效', value: '1'},
          //                {key: '未生效', value: '2'},
          //                {key: '已完成', value: '3'}
          //              ],
          //              default: 'all'
          //            }
          //          ]

        }
      }
    },

    data() {
      let model = {}

      this.reset(model)

      return {
        visible: null,
        model: model
      }
    },

    computed: {
      className() {
        return {
          'js-filter': true,
          'visible': this.show,
          'on-nav-shown': this.$store.state.frame.navVisible
        }
      }
    },

    watch: {
      show: function (value) {
        if (value) {
          // 如果显示则阻止页面后退键
          Backbutton.prevent(() => {
            this.$emit('close', this.model)
          })
          this.$store.commit('hideNav')
        } else {
          Backbutton.remove()
          this.$store.commit('showNav')
        }
      }
    },

    mounted() {
      document.body.appendChild(this.$refs.pannels.$el)
    },

    beforeDestroy() {
      let pannels = this.$refs.pannels.$el

      pannels.parentNode.removeChild(pannels)
      this.$store.commit('showNav')
    },

    methods: {

      // 重置
      reset(model) {
        model = model || this.model

        this.options.forEach(section => {
          if (section.multipe) {
            model[section.key] = isArray(section.default) ? section.default : [section.default]
          } else {
            model[section.key] = section.default
          }
        })
      },

      resetItem(event, key) {
        let isChanged

        event.stopPropagation()

        this.options.forEach(section => {
          let cate

          if (section.key === key) {

            if (section.type === 'numberRange') {
              cate = this.getCateByValue(section, section.default)
              this.selectCate(section, cate)
            }

            Vue.set(this.model, key, section.default)
            isChanged = true
          }
        })

        isChanged && this.done()
      },

      getKeys(list) {
        return Object.keys(groupBy(list, 'key'))
      },

      orgUserFormatter(list = []) {
        let kv = []

        list.forEach(item => {
          kv.push({key: item.name, value: item.id})
        })

        return kv
      },

      check(section, item) {

        // 多重选择
        if (section.multipe === true) {
          let list = this.model[section.key] || []

          if (section.default === item.value) {
            this.model[section.key] = [section.default]
          } else if (this.isChecked(section, item)) {
            list = filter(list, (opt) => {
              return opt !== item.value
            })
            this.model[section.key] = union(list)
          } else {
            list.push(item.value)
            this.model[section.key] = union(list)
          }
        } else {
          if (this.isChecked(section, item)) {
            Vue.set(this.model, section.key, section.default)
          } else {
            Vue.set(this.model, section.key, item.value)
          }
        }
      },

      /**
       * 判断选项是否选中
       * @param section
       * @param item
       * @return {*}
       */
      isChecked(section, item) {
        let isChecked
        let list
        let defaultValue = section.default

        if (section.multipe === true) {
          list = this.model[section.key]

          if (!isUndefined(defaultValue) && item.value === defaultValue) {
            if (list.length > 1 && list.indexOf(defaultValue) !== -1) {
              isChecked = false
            } else {
              isChecked = true
            }
          } else {
            isChecked = list.indexOf(item.value) !== -1
          }

        } else {
          isChecked = this.model[section.key] === item.value
        }

        return isChecked
      },

      /**
       * 选人组件选择后自动选中
       */
      onOrgChange(section) {
        if (section.multipe) {
          this.model[section.key]
        } else {

        }
      },

      selectCate(section, cate) {
        section.categories.forEach((cg) => {
          Vue.set(cg, 'current', cate.key === cg.key)
          this.model[section.key] = cate.value
        })
      },

      getCateByValue(section, value) {
        let list = section.categories || []
        let category

        list.forEach((cate) => {
          if (cate.value[0] <= value[0] && value[1] <= cate.value[1]) {
            category = cate
          }
        })
        return category
      },

      getCurrentCate(section) {
        let curr = find(section.categories, 'current')

        return curr || section.categories[0] || {}
      },

      isDefaultValue(key, value) {
        let result

        value = isArray(value) ? value.join(',') : value

        this.options.forEach((section) => {
          let def = section.default

          def = isArray(def) ? def.join(',') : def

          if (section.key === key && def.toString() === value.toString()) {
            result = true
          }
        })

        return result
      },

      getLabel(key, value) {
        let label
        let opt

        this.options.forEach((section) => {
          let list

          if (section.key === key) {
            // 数字区间
            if (['numberRange'].indexOf(section.type) !== -1) {
              list = section.categories || []
              list.forEach((cate) => {
                let isBreak

                if (cate.value[0] === value[0] && value[1] === cate.value[1]) {
                  label = cate.key
                  isBreak = false
                } else if (cate.value[0] <= value[0] && value[1] <= cate.value[1]) {
                  label = `${cate.key} (${value.join('~')})`
                  isBreak = false
                }

                return isBreak
              })
              label = label || value.join('~')
            } else if (isArray(value)) {
              opt = filter(section.list, item => {
                return value.indexOf(item.value) !== -1
              })
              label = Object.keys(groupBy(opt, 'key')).join(',')
            } else if (value) {
              opt = filter(section.list, item => {
                return item.value === value
              })
              label = opt && opt.length > 0 ? opt[0].key : ''
            }
          }
        })

        return label
      },

      open() {
        this.$emit('open')
      },

      done() {
        let value = Object.assign({}, this.model)
        console.log(value)
        this.$emit('close')
        this.$emit('success')
        this.$emit('input', value)
      }
    }
  }
</script>

<style lang="less" scoped="">
  @import url("../../styles/vars");

  .js-filter {
    display: none;
    animation-timing-function: cubic-bezier(.5, 0, .5, 1);
    position: absolute;
    z-index: 2;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;

    &.on-nav-shown {
      bottom: 5rem;
    }

    &.visible {
      display: block;
      background-color: #fff;
    }

    &.js-filter-enter-active {
      animation: slideInDown .3s;
      z-index: 1;
    }

    &.js-filter-leave-active {
      animation: slideOutUp .45s;
    }

    .pannels {
      xheight: 100%;
      xoverflow: auto;
      xpadding-bottom: 5rem;
    }
    .mu-flat-button {
      //width: 8.3rem;
    }
    .btn-check {
      font-size: 1.4rem;
      font-weight: 500;
      color: #999999;
      letter-spacing: 0;
      border-radius: .4rem;
      margin: 0 1.2rem .8rem 0;
      background-color: #f4f4f4;

      &.mu-flat-button-primary {
        color: #3B7CEC;
        background-color: rgba(134, 178, 255, 0.22);
        border-radius: .4rem;
      }
    }

    .btn-category {
      height: inherit;
      line-height: normal;
      min-width: initial;
      font-size: 1.1rem;
      font-weight: 200;
      letter-spacing: 0;
      color: #c1c1c2;

      &.mu-flat-button-primary {
        color: #3B7CEC;

      }

      .mu-flat-button-label {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
        font-size: 1.4rem;
        font-family: PingFangSC-Regular;
        color: #999999;
      }
    }

    .btn-add-option {
      display: inline-block;
      background-color: #f4f4f4;
      border-radius: .4rem;
      .mu-flat-button-primary {
        color: #cccccc;
      }
    }

    .js-page-footer {
      bottom: 0 !important;
    }
  }

  .filter-condition {
    padding: 1rem 2rem 0 2rem;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    color: @color-primary;
    font-size: 1.3rem;

    span {
      background: #E5EFFF;
      border-radius: .4rem;
      display: block;
      padding: .8rem 1.2rem;
      margin: 0.3rem 1rem .3rem 0;
      position: relative;
      .icon {
        width: 1.4rem;
        height: 1.4rem;
        position: absolute;
        top: -.4rem;
        right: -.6rem;
      }
    }
  }
</style>

<style lang="less">
  .js-filter {
    .js-page-footer {
      bottom: 0 !important;
    }
  }
</style>
