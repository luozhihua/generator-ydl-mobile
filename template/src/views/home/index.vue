<template>
  <Page title="首页" nav-group="home" :nav-hidden="false" ref="page">
    <section class="primary">
      <div class="header-info row">
        <div class="col">
          <div class="row">
            <div class="col">
              <span class="day">{{today.date}}</span>
            </div>
            <div class="col">
              <div class="week">{{today.day}}</div>
              <div class="date">{{today.ym}}</div>
            </div>
          </div>
        </div>
        <div class="col marquee">
          <div class="marquee-con">
            <div class="list">
              <a v-for="(item, index) in marqueeData" :key="index">{{item.content}}</a>
            </div>
          </div>
        </div>
      </div>

      <div class="header-subnav">
        <!-- 老板权限-->
        <div v-if="isManager" class="row">
          <div class="col col-4" @click="followUpRecord()">
            <i class="yd-icon yd-genjinchuli block"></i> 看跟进记录
          </div>
          <div class="col col-4" @click="teamReport()">
            <i class="yd-icon yd-gengxinrizhi block"></i> 看团队日报
          </div>
          <div class="col col-4" @click="examine()">
            <i class="yd-icon yd-contract_line block"></i>
            审批
          </div>
          <div class="col col-4" @click="$refs.page.scrollTo('look-sj')">
            <i class="yd-icon yd-jinqizhongdianshangji block"></i> 看重要商机
          </div>
        </div>
        <!-- 销售员权限-->
        <div v-if="!isManager" class="row">
          <div class="col col-4" @click="goSign">
            <i class=" icon qiandaodaka block"></i> 签到
          </div>
          <div class="col col-4" @click="writeRecords">
            <i class=" icon xiegenjing block"></i> 写跟进记录
          </div>
          <div class="col col-4" @click="writeReport()">
            <i class=" icon xieribao block"></i> 写日报
          </div>
          <div class="col col-4" @click="newOppertunity()">
            <i class="icon jianshangji block"></i> 建商机
          </div>
        </div>
      </div>
      <div v-if="salesTarget.target - salesTarget.complete >= 0" class="target"
           @click="$refs.page.scrollTo('sales-performance')">
        <div>离{{isManager == true ? '团队' : '个人'}}销售目标</div>
        <div>还差
          <Number :type="('currency:'+ salesTarget.digit)" :value="salesTarget.target - salesTarget.complete"></Number>
          {{salesTarget.unit}}！
        </div>
        <p>只剩下
          <Number :value="salesTarget.date"></Number>
          天打单，加油！
          <!-- <Button tag="a" size="small">秘籍传送门</Button> -->
        </p>
      </div>

      <div v-if="salesTarget.target - salesTarget.complete < 0" class="target"
           @click="$refs.page.scrollTo('sales-performance')">
        <div>超过{{isManager == true ? '团队' : '个人'}}销售目标</div>
        <div>
          <Number :type="('currency:'+ salesTarget.digit)" :value="salesTarget.complete - salesTarget.target"></Number>
          {{salesTarget.unit}}！太棒了！
        </div>
        <p>还有
          <Number :value="salesTarget.date"></Number>
          天打单，继续加油！
          <!-- <Button tag="a" size="small">秘籍传送门</Button> -->
        </p>
      </div>

    </section>
    <!--销售简报-->
    <Panel class="sales-brief-report" border="none">
      <div slot="header-left" class="w-100">销售简报</div>
      <div slot="header-right">
        <ButtonGroup slot="header-right">
          <ButtonBase @click="switchWeek(1)" size="min" class="active">本周</ButtonBase>
          <ButtonBase @click="switchWeek(2)" size="min">上周</ButtonBase>
        </ButtonGroup>
      </div>
      <ul>
        <li v-for="(report, index) in briefReport.list" :key="index">
          <h3>
            <Number :value="report.number"></Number>
            {{ report.unit }}
          </h3>
          <div>
            <p v-html="report.text"></p>
            <p v-html="report.text2"></p>
          </div>
        </li>
      </ul>
    </Panel>

    <!-- 暂时模拟背景 -->
    <div class="gray-box" style="display: block;width: 100vw;height: .5rem;background: #efeef0;">
    </div>

    <div id="sales-performance"></div>
    <Goal></Goal>
    <Funnel></Funnel>


    <!--销售业绩模块-->
    <!--
    <Panel>
      <div slot="header-left">
        <mu-select-field v-model="salesPerformance.filter.time" class="panel-title-select" :labelfloat="true"
                         :underlineshow="false">
          <mu-menu-item value="month" title="当月销售业绩"/>
          <mu-menu-item value="quarter" title="当季销售业绩"/>
          <mu-menu-item value="year" title="当年销售业绩"/>
        </mu-select-field>
      </div>
      <div slot="header-right">
        <ButtonGroup>
          <ButtonBase @click="salesPerformance.filter.switch='self'" size="small">个人</ButtonBase>
          <ButtonBase @click="salesPerformance.filter.switch='team'" size="small" class="active">团队</ButtonBase>
        </ButtonGroup>
      </div>
      <div class="row sales-performance" id="sales-performance">
        <div class="col">
          <dl>
            <dt>团队销售目标</dt>
            <dd>
              <Number :value="salesTarget.target"></Number>
              {{salesTarget.unit}}
            </dd>
          </dl>
          <dl>
            <dd>完成业绩
              <Number :value="salesTarget.complete"></Number>
              {{salesTarget.unit}}
            </dd>
            <dd>已回款
                <Number :value="salesPerformance.data.payback"></Number>
                {{salesTarget.unit}}
              </dd>
          </dl>
        </div>
        <div class="col sales-performance-chart">
          <Echart v-if="startCharts" :options="salesPerformance.echartOptions" height="100%"></Echart>
        </div>
        <div class="col sales-chart-data">
          <dl>
            <dt>
              <Number :value="salesPerformance.data.percent" unit="%"></Number>
            </dt>
            <dd>
              离目标还有
              <Number :value="salesTarget.date" unit=""></Number>
              天
            </dd>
          </dl>
        </div>
        <div class="col">
            <dl>
              <dt>
                <Number :value="salesPerformance.data.predict"></Number>
                万元
              </dt>
              <dd>预计完成</dd>
            </dl>
            <dl>
              <dt>
                <Number :value="salesPerformance.data.funnel"></Number>
                万元
              </dt>
              <dd>漏斗总值</dd>
            </dl>
          </div>
      </div>
    </Panel>-->

    <!-- 暂时模拟背景 -->
    <div class="gray-box" style="display: block;width: 100vw;height: .5rem;background: #efeef0;">
    </div>

    <!--销售漏斗模块-->
    <!-- <Panel w_100="w-100">
      <div slot="header-left" class="w-100">
        <tab :queryParms="salesFunnelData"></tab>

      </div>
      <div slot="header-right">
      </div>
      <div class="row funnel">
        <div class="chart-funnel">
          <Echart v-if="startCharts" :options="salesFunnel.funnel" height="100%"></Echart>
        </div>
        <div class="col">
          <p>预计{{showDays[salesFunnel.filter.time]}}销售总额</p>

          <Number :type="('currency:'+ salesTarget.digit)" class="big-text" :value="salesFunnel.data.predict" :unit="salesTarget.unit" ></Number>
          <p>
            赢单
            <Number :type="('currency:'+ salesTarget.digit)" v-if="salesFunnel.filter.switch==='money'" :value="salesFunnel.data.win"
                    :unit="salesTarget.unit" ></Number>
            <Number v-if="salesFunnel.filter.switch==='number'" :value="salesFunnel.data.win" unit="个商机"></Number>
          </p>
        </div>
      </div>
    </Panel> -->

    <!-- 暂时模拟背景 -->
    <div class="gray-box" style="display: block;width: 100vw;height: .5rem;background: #efeef0;">
    </div>

    <!--当月可能签单商机-->
    <Panel class="posible-clues" w_100="w-100">
      <div slot="header-left" class="w-100">
        <!--<mu-select-field style="display:none" v-model="posibleClues.filter.dataType" class="panel-title-select"-->
        <!--:labelfloat="true"-->
        <!--:underlineshow="false">-->
        <!--<mu-menu-item value="month" title="当月可能签单商机"/>-->
        <!--<mu-menu-item value="quarter" title="当季可能签单商机"/>-->
        <!--<mu-menu-item value="year" title="当年可能签单商机"/>-->
        <!--</mu-select-field>-->

        <tab :queryParms="posibleCluesData"></tab>
      </div>
      <div slot="header-right"></div>
      <div>
        <div slot="header-right"></div>
        <div>
          <div class="clue-count" id="look-sj">
            商机总额
            <Number v-model="chanceStatistic.realPriceFormat" :unit="salesTarget.unit" type="currency:2"></Number>
            商机总数量
            <Number v-model="chanceStatistic.chanceCount" unit="个"></Number>
          </div>

          <ul class="clue-tabs">
            <li :class="{active: posibleClues.filter.orderType === 7}">
              <a @click="posibleClues.filter.orderType=7" href="javascript:void(0)">
                <span>10</span>
                <em>赢率最高</em>
              </a>
            </li>
            <li :class="{active: posibleClues.filter.orderType === 3}">
              <a @click="posibleClues.filter.orderType=3" href="javascript:void(0)">
                <span>10</span>
                <em>金额最大</em>
              </a>
            </li>
          </ul>

          <div class="clue-list">
            <transition-group name="fadeIn" tag="ul">

              <li v-for="(clue, index) in posibleClues.list" v-if="posibleClues.filter.orderType === 7" :key="clue.id"
                  @click="goChanceDetail(clue.sid,clue.id)">
                <div class="row clue-title">
                  <div class="col">{{ clue.businessName }}</div>
                  <div class="col">预计结单 {{ formatDate(clue.deliverTime) }}</div>
                </div>
                <div class="clue-details">
                  <span>{{clue.distributorName}} </span>
                  <span> <i v-for="(productName, i) in (clue.productNames || [])"
                  >{{productName}} </i></span>
                  <span>|<Number :value="clue.realPrice" type="￥:currency:2"></Number></span>

                </div>
              </li>


              <li v-for="(clue, index) in (posibleClues.list1.length > 0 ? posibleClues.list1 : posibleClues.list)"
                  v-if="posibleClues.filter.orderType === 3" :key="clue.id" @click="goChanceDetail(clue.sid,clue.id)">
                <div class="row clue-title">
                  <div class="col">{{ clue.businessName }}</div>
                  <div class="col">预计结单 {{ formatDate(clue.deliverTime) }}</div>
                </div>
                <div class="clue-details">
                  <span>{{clue.distributorName}} </span>
                  <span> <i v-for="(productName, i) in (clue.productNames || [])"
                  >{{productName}} </i></span>
                  <span>|<Number :value="clue.realPrice" type="￥:currency"></Number></span>

                </div>
              </li>

              <!--<li v-for="(clue, index) in posibleClues.list">-->
              <!--<div class="row">-->
              <!--<div class="col">季度过程配套设施</div>-->
              <!--<div class="col"> 预计接单 07/16/2012 </div>-->
              <!--</div>-->
              <!--<div>-->
              <!--一豆信息科技 | 电脑配套设施 | 120万-->
              <!-- <!--</li>-->
            </transition-group>


            <!-- <a href="/opportunity" class="clue-more">查看更多 <i class="yd-icon yd-arrow-down"></i> </a> -->
          </div>
        </div>
      </div>
    </Panel>
  </Page>
</template>

<script>
  import moment from 'moment';
  import util from 'utils/utils';
  import Goal from '../analysis/panels/goal.vue';
  import Funnel from '../analysis/panels/funnel.vue';

  export default {

    components: {
      Goal,
      Funnel
    },

    data() {
      let vm = this;

      return {
        isManager: true,
        startCharts: false,

        // 跑马灯定时器对象
        marqueeTime: '',
        marqueeData: [],
        // 月/季/年
        mqy: {
          year: 2017,
          month: 1,
          quarter: 1
        },
        showDays: {
          year: '当年',
          month: '当月',
          quarter: '当季'
        },
        //销售漏斗tab
        salesFunnelData: {
          title: '销售漏斗',
          data: [
            {name: '当月', key: 'month'},
            {name: '当季', key: 'quarter'},
            {name: '当年', key: 'year'},
          ],
          selectCallback(data) {
            vm.salesFunnel.filter.time = data.key;
          }
        },
        //签单商机tab
        posibleCluesData: {
          title: '可能签单商机',
          data: [
            {name: '当月', key: 'month'},
            {name: '当季', key: 'quarter'},
            {name: '当年', key: 'year'},
          ],
          selectCallback(data) {
            vm.posibleClues.filter.dataType = data.key;
            if (vm.posibleClues.filter.orderType === 7) {
              vm.posibleClues.list1 = [];
            } else {
              vm.posibleClues.list = [];

            }
            vm.reLoadPosibleCluesData = true;
            //  vm.loadPosibleClues();
          }
        },
        reLoadPosibleCluesData: false,

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

        // 页面顶部的日期
        today: {
          date: moment().format('DD'),
          ym: moment().format('YYYY年MM月'),
          day: '星期' + ['日', '一', '二', '三', '四', '五', '六'][moment().format('d')]
        },

        /**
         * 离销售目标的差额
         */
        salesTarget: {
          money: 0,
          date: 0,
          target: 0,
          complete: 0,
          percent: 0,
          rate: 1,
          unit: '',
          digit: ''
        },

        /**
         * 销售简报
         */
        briefReport: {
          list: []
        },

        /**
         * 销售业绩模块的数据
         */
        salesPerformance: {
          filter: {
            time: 'month',
            switch: 'team' // or self 团队或个人按钮切换
          },
          data: {
            target: 0,
            completed: 0,
            payback: 0,
            predict: 0,
            funnel: 0,
            percent: 0
          },

          // 销售业绩的图标配置
          echartOptions: {
            tooltip: {
              show: true
            },
            series: [{
              name: '值',
              type: 'pie',
              clockWise: true, // 顺时加载
              hoverAnimation: false, // 鼠标移入变大
              radius: ['95%', '96%'],
              startAngle: 90,
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  barBorderRadius: 1
                }
              },
              data: [{
                value: 10,
                itemStyle: {
                  normal: {
                    borderWidth: 3 / this.PIXEL_RATIO,
                    borderColor: '#cccccc'
                  }
                }
              }, {
                value: 10,
                name: '回收',
                itemStyle: {
                  normal: {
                    borderWidth: 3 / this.PIXEL_RATIO,
                    borderColor: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: 'rgba(59,124,236,0.2)' // 0% 处的颜色
                      }, {
                        offset: 1,
                        color: '#3B7CEC' // 100% 处的颜色
                      }],
                      globalCoord: false // 缺省为 false
                    }
                  }
                }
              }]
            }]
          }
        },

        /**
         * 销售漏斗模块的数据
         */
        salesFunnel: {
          filter: {
            time: 'month',
            switch: 'money' // or money 数量或金额按钮切换
          },
          data: {
            predict: 0,
            win: 0,
            business: 0
          },
          funnel: {
            color: ['rgba(59,124,236,0.2)', '#3B7CEC'],
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c}%',
              show: false
            },
            series: [
              {
                name: '漏斗图',
                type: 'visualFunnel',
                top: '2%',
                bottom: '2%',
                left: '2%',
                right: '24%',
                neckWidth: '20%',
                neckStart: '60%',
                sort: 'ascending', // ascending, descending
                label: {
                  normal: {
                    position: 'right',
                    show: true,
                    formatter: function (params) {
                      return (params.data.count || 0).toFixed(2);
                    }
                  },
                  emphasis: {
                    position: 'right',
                    show: true,
                    formatter: function (params) {
                      // debugger;
                      return (params.data.count || 0).toFixed(2);
                    }
                  }
                },
                data: [
                  {
                    value: 0,
                    name: ''
                  },
                  {
                    value: 0,
                    name: ''
                  },
                  {
                    value: 0,
                    name: ''
                  }
                ]
              }
            ]
          }
        },

        chanceStatistic: {
          chanceCount: 0,
          realPriceFormat: 0
        },
        /**
         * 可能签单商机的数据
         */
        posibleClues: {
          filter: {
            dataType: 'month', // 月度，季度，年度
            orderType: 7, // 排序
            statusMin: 8, // status >= 8
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            quarter: parseInt(new Date().getMonth() / 3 + 1, 10)
          },
          // originList: [
          //   {
          //     id: '1',
          //     title: '1. 季度工程配套设施',
          //     time: new Date() + 1,
          //     companyName: '一豆信息科技',
          //     productName: '电脑配套设施',
          //     amount: Math.floor(Math.random() * 1000)
          //   }, {
          //     id: '2',
          //     title: '2. 季度工程配套设施',
          //     time: new Date() + 1,
          //     companyName: '一豆信息科技',
          //     productName: '电脑配套设施',
          //     amount: Math.floor(Math.random() * 1000)
          //   }, {
          //     id: '3',
          //     title: '3. 季度工程配套设施',
          //     time: new Date() + 1,
          //     companyName: '一豆信息科技',
          //     productName: '电脑配套设施',
          //     amount: Math.floor(Math.random() * 1000)
          //   }, {
          //     id: '4',
          //     title: '4. 季度工程配套设施',
          //     time: new Date() + 1,
          //     companyName: '一豆信息科技',
          //     productName: '电脑配套设施',
          //     amount: Math.floor(Math.random() * 1000)
          //   }
          // ],
          list: [],
          list1: [],
        },

        /**
         * 顶部右侧钉钉自定义菜单
         */
        // dingMenus: [
        //   {
        //     id: 0,
        //     iconId: 'add',
        //     text: 'New',
        //     onClick: () => {
        //       // this.showFilter = !this.showFilter
        //     }
        //   }, {
        //     id: 1,
        //     iconId: 'edit',
        //     text: 'Edit',
        //     onClick: () => {
        //       this.edit();
        //     }

        //   }, {
        //     id: 2,
        //     iconId: 'trash',
        //     text: 'Delete',
        //     onClick: () => {
        //       this.del();
        //     }
        //   }, {
        //     id: 3,
        //     iconId: 'setting',
        //     text: 'Settings',
        //     onClick: () => {
        //       this.setting();
        //     }
        //   }
        // ]
      };
    },

    created() {
      let now = new Date();

      this.mqy.year = now.getFullYear();
      this.mqy.month = now.getMonth() + 1;
      this.mqy.quarter = Math.floor(now.getMonth() / 3 + 1);
      this.load();
    },

    mounted: function () {
      this.getManager();
      this.loadSalesTarget();
      this.loadSalesPerformance();
      // this.loadSalesFunnel();
      this.loadPosibleClues();
      this.loadBriefReport();

      setTimeout(() => {
        this.startCharts = true;
      }, 400);
    },

    watch: {
      'salesPerformance.filter': {
        handler(/* value, old */) {
          // this.loadSalesPerformance()
          this.loadSalesTarget();
        },
        deep: true
      },

      'salesFunnel.filter': {
        handler(/* value, old */) {
          this.loadSalesFunnel();
        },
        deep: true
      },

      'posibleClues.filter': {
        handler(/* value, old */) {
          this.loadPosibleClues();
        },
        deep: true
      }
    },

    methods: {

      ... util,

      // 点击定位位置
      lookSj() {
        let element = document.getElementById('look-sj');

        element.scrollIntoView();
      },

      // 点击签到
      goSign() {
        this.$router.push('/sign');
      },

      // 写跟进记录
      writeRecords() {
        this.$router.push('/sign?type=2');
      },

      // 跑马灯动画
      marquee() {
        /*
        let el = $('.marquee');
        let tempEl = el.find('.marquee-con').html();

        el.find('.marquee-con').append(tempEl);

        let w = el.width();
        let tempW = w * el.find('.list').eq(0).find('a').length;

        el.find('.list a').width(w);
        let len = 0,
          wait = 0,
          flag = false;

        function setPos() {
          // 设置位移
          if (len % w === 0) {
            flag = false;
            wait++;
            if (wait >= 500) {
              flag = true;
              wait = 0;
            }
          }
          if (flag) {
            if (len >= tempW) {
              len = 0;
            } else {
              len++;
            }
            el.find('.marquee-con .list').eq(0).css('margin-left', '-' + len + 'px');
          }
        }

        this.marqueeTime = setInterval(setPos, 1000 / 30);
        */
      },

      // 部门领导判断
      getManager() {
        this.$ajax.get('/api/userCenter/judgeCurrentUsrIsManager').then(results => {
          this.isManager = results.data;
          this.$storage.setItem('isManager', results.data);
          // debugger
        });
      },
      // 加载跑马灯
      async loadMarquee() {
        // this.marqueeData= [{"id":77773,"content":"大事件"},{"id":77773,"content":"小事件"},{"id":77773,"content":"没有事件"}];
        // return
        let url = '/api/message/queryInformationPage?moduleType=notice'
        let results = await this.$ajax.get(url);

        this.marqueeData = results.data;
        this.marquee();

      },
      // 查看跟进纪录
      followUpRecord: function () {
        this.$router.push('/follow-up-record');
      },
      // 看团队日报
      teamReport: function () {
        this.$router.push('/daily-report/team-report');
      },
      examine: function () {
        this.$router.push('/examine');
      },
      writeReport: function () {
        this.$router.push('/daily-report/add?type=1');
      },
      newOppertunity: function () {
        this.$router.push('/opportunity/add');
      },
      load() {
        Promise.all([
          this.$ajax.get('/api/enumItem/getFormatNumberEnum')
        ]).then(results => {
          let data = results[0].data;

          this.countFormat.countRate = data.countRate;
          this.countFormat.countUnit = data.countUnit;
          this.countFormat.priceRate = data.priceRate;
          this.countFormat.priceUnit = data.priceUnit;
        });
        this.loadMarquee();
      },

      /**
       * 加载销售目标
       */
      async loadSalesTarget() {
        let hasChild = this.salesPerformance.filter.switch === 'self' ? 'false' : 'true';
        let url = '/api/dashboard/salesAchievementWithoutProd';
        let {data} = await this.$ajax.get(url, {
          params: {
            unitType: '',
            hasChild: hasChild,
            viewType: 0,
            dataType: this.salesPerformance.filter.time,
            year: this.mqy.year,
            month: this.mqy.month,
            quarter: this.mqy.quarter
          }
        });

        // debugger;
        // console.log(data); // 服务器返回的数据

        if (data && data.length > 0) {
          if (data[0].unitType === 'price') {
            this.salesTarget.digit = 2;
            this.salesTarget.rate = this.countFormat.priceRate;
            this.salesTarget.unit = this.countFormat.priceUnit;
          } else {
            this.salesTarget.digit = 0;
            this.salesTarget.rate = this.countFormat.countRate;
            this.salesTarget.unit = this.countFormat.countUnit;
          }

          // debugger;
          this.salesTarget.complete = data[0].complete / this.salesTarget.rate;
          this.salesTarget.target = data[0].target / this.salesTarget.rate;
        }

        // this.salesTarget.money = Math.floor(Math.random() * 800) // 离销售目标还差 xx 万
        // this.salesTarget.date = Math.floor(Math.random() * 30) // 只剩下x天打单
        // debugger
        if (this.salesPerformance.filter.time === 'month') {
          this.salesTarget.date = this.getDayNum(this.salesPerformance.filter.time, this.mqy.month);
        } else if (this.salesPerformance.filter.time === 'quarter') {
          this.salesTarget.date = this.getDayNum(this.salesPerformance.filter.time, this.mqy.quarter);
        } else {
          this.salesTarget.date = this.getDayNum(this.salesPerformance.filter.time, this.mqy.year);
        }

      },

      /**
       * 加载销售业绩
       */
      async loadSalesPerformance() {
        let {echartOptions} = this.salesPerformance;
        // let url = '/vue/data.json'
        // let {data} = await this.$ajax.get(url, {
        //   params: filter
        // })

        console.log(this.salesPerformance)
        echartOptions.series[0].data[0].value = this.salesTarget.target - this.salesTarget.complete;
        echartOptions.series[0].data[1].value = this.salesTarget.complete;
        // this.salesPerformance.data = data
        // debugger;
        this.salesPerformance.data.target = this.salesTarget.target;
        this.salesPerformance.data.completed = this.salesTarget.complete;
        this.salesPerformance.data.percent = (this.salesTarget.complete / this.salesTarget.target) || 0;
        this.salesPerformance.data.payback = (Math.random() * 1000).toFixed(0);
        this.salesPerformance.data.predict = (Math.random() * 1000).toFixed(0);
        this.salesPerformance.data.funnel = (Math.random() * 1000).toFixed(0);
      },

      /**
       * 加载销售漏斗
       */
      async loadSalesFunnel() {
        // debugger;
        let funelUrl = '/api/order/queryChanceStagesStatistic';

        if (this.salesFunnel.filter.switch === 'number') {
          funelUrl = '/api/order/queryStagesCountStatistic';
        }

        Promise.all([
          this.$get(funelUrl, {
            params: {
              dataType: this.salesFunnel.filter.time,
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

          this.$get('/api/order/querySubManagerChanceStatistic', {
            params: {
              dataType: this.salesFunnel.filter.time,
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
          })
        ]).then(results => {
          // debugger;
          let [funels, forcast] = results;
          let data = funels.data;
          let {series} = this.salesFunnel.funnel;
          let funelDatas = [];

          debugger

          data.forEach(data => {
            // 不要输单
            if (data.stage.key !== -7) {
              let funelData = {};

              funelData.value = data.stage.index;
              funelData.name = data.stage.name;
              funelData.unit = this.salesTarget.unit
              if (this.salesFunnel.filter.switch === 'number') {
                funelData.count = data.statistic.productCount;
              } else {
                funelData.count = data.statistic.realPriceFormat;
              }

              funelDatas.push(funelData);
            }

          });
          if (this.salesFunnel.filter.switch === 'number') {
            this.salesFunnel.data.win = data[data.length - 2].statistic.productCount;
            this.salesFunnel.data.predict = forcast.data[0].productCountFormat || 0;
          } else {
            this.salesFunnel.data.win = data[data.length - 1].statistic.realPriceFormat;
            this.salesFunnel.data.predict = forcast.data[0].realPriceFormat || 0;
          }
          series[0].data = funelDatas;
        });
      },
      //简报查询按周查询
      async switchWeek(weekType) {
        let url = 'api/briefReport/queryBriefReportByWeek?weekType=' + weekType;
        let {data} = await this.$ajax.get(url);
        let list = [];

        if (data) {
          data.forEach(obj => {
            let json = JSON.parse(obj.jsonData);
            let all = {};

            all.number = json.num;
            all.unit = json.unit;
            all.text = json.content1;
            all.text2 = json.content2;
            list.push(all);
          });

          this.briefReport.list = list;
        }
      },
      async loadBriefReport() {
        //let url = 'api/briefReport/queryBriefReport';
        let url = 'api/briefReport/queryBriefReportByWeek?weekType=1';
        let {data} = await this.$ajax.get(url);
        let list = [];

        if (data) {
          data.forEach(function (i, obj) {
            let json = JSON.parse(obj.jsonData);
            let all = {};

            all.number = json.num;
            all.unit = json.unit;
            all.text = json.content1;
            all.text2 = json.content2;
            list.push(all);
          });
          // debugger
          this.briefReport.list = list;
        }
      },

      /**
       * 加载可能签单商机的数据
       */
      async loadPosibleClues() {

        let statistic = await this.$ajax.get('/api/order/queryChanceStatistic', {
          params: this.posibleClues.filter
        });

        if (statistic.data) {
          this.chanceStatistic = statistic.data;
        }
        if (!this.reLoadPosibleCluesData) {
          if (
            (
              this.posibleClues.filter.orderType === 7 &&
              this.posibleClues.list.length > 0
            ) || (
              this.posibleClues.filter.orderType === 3 &&
              this.posibleClues.list1.length > 0
            )
          ) {
            return
          }
        }
        let url = '/api/phone/order/queryTopChance';
        let resp = await this.$ajax.get(url, {
          params: this.posibleClues.filter
        });

        // console.log(data) // 服务器返回的数据

        // let list = [].concat(this.posibleClues.originList)
        //   .concat(this.posibleClues.originList)
        // let dist = []
        // let a = Math.max(3, Math.floor((Math.random() * list.length)))

        // for (let i = 0; i < a; i++) {
        //   dist.push(list[i])
        // }

        //this.posibleClues.list = resp.data;
        if (this.posibleClues.filter.orderType === 7) {
          this.posibleClues.list = resp.data;
        } else {
          this.posibleClues.list1 = resp.data;
        }
        this.reLoadPosibleCluesData = false;
      },

      goChanceDetail(sid, id) {
        this.$router.push(`/opportunity/detail?sid=${sid}&id=${id}`);
      },

      getDayNum(type, num) {
        let date = new Date();
        let year = new Date().getFullYear();
        let time1,
          time2;

        if (type === 'month') { // 月
          date = this.getMonthLastDay(year, num);
        } else if (type === 'quarter') { // 季度
          date = this.getLastQuarterDay(year, num);
        } else if (type === 'year') { // 年
          date = this.getLastQuarterDay(year, 4);
        }
        time1 = new Date().getTime();
        time2 = new Date(date).getTime();

        return this.getOffsetDays(time1, time2); // 返回数据，俩个时间的差值
      },
      // 获取某月最后一天日期
      getMonthLastDay(year, month) {
        let lastMonth = month;
        let newYear = year;
        let newMonth = month++;
        let newDate,
          day;

        if (month > 12) {
          newMonth -= 12; // 月份减
          newYear++; // 年份增
        }
        newDate = new Date(newYear, newMonth, 1);
        day = (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate();

        return year + (lastMonth > 10 ? '-' : '-0') + lastMonth + '-' + day;
      },

      // 获取季度最后一天
      getLastQuarterDay(year, quarter) {
        let lastDate = '0';
        let day;

        if (parseInt(quarter, 10) === 1) {
          day = new Date(year, 3, 0);

          lastDate = year + '-0' + 3 + '-' + day.getDate(); // 获取第一季度最后一天日期
        } else if (parseInt(quarter, 10) === 2) {
          day = new Date(year, 6, 0);

          lastDate = year + '-0' + 6 + '-' + day.getDate(); // 获取第二季度最后一天日期
        } else if (parseInt(quarter, 10) === 3) {
          day = new Date(year, 9, 0);

          lastDate = year + '-0' + 9 + '-' + day.getDate(); // 获取第三季度最后一天日期
        } else if (parseInt(quarter, 10) === 4) {
          day = new Date(year, 12, 0);

          lastDate = year + '-' + 12 + '-' + day.getDate(); // 获取第四季度最后一天日期
        }

        return lastDate;
      },
      // 获取俩个时间的相差天数
      getOffsetDays(time1, time2) {
        let offsetTime = Math.abs(time1 - time2);

        return Math.floor(offsetTime / (3600 * 24 * 1000));
      }
    },

    destroyed() {
      // 销毁页面对象
      clearInterval(this.marqueeTime);
    }
  }

</script>

<style lang="less" scoped>
  @import url("./style.less");
</style>
