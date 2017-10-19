<template>
<Page>
  <filterlist v-model="list" url="/vue/filter-list.json" search-by="username" placeholder="Search for..." :params="filterParams" keyword="colin">
    <ul>
      <filterpanel v-model="filterParams" :options="filterOptions" :show="showFilter" @open="showFilter=true" @close="showFilter=false"></filterpanel>
      ---------商机列表----------
      <li class="business">
        <div>
          <p>风化项目</p>
          <p>风化股份有限公司</p>
        </div>
        <div> ￥ 50,000 </div>
      </li>
      ---------线索列表----------
      <li class="clue">
        <div>
          <p>风化项目</p>
          <p>风化股份有限公司</p>
        </div>
        <div>
          <p>跟进1次，最近跟进时间</p>
          <p>03-02 22:25</p>
        </div>
      </li>
      ---------客户列表--合作伙伴列表--------
      <li class="client">
        <p>马小六</p>
        <p>上海春风科技有限公司</p>
      </li>
      ---------商机 合同列表---------- @ ---------商机 订单----------
      <li class="order">
        <div>
          <p>SO#20170708#434562–1</p>
          <p>上海报读销售采购合同</p>
          <p>¥ 240000</p>
        </div>
        <div>
          <p>19 / 07 / 2017</p>
          <p>回款中</p>
        </div>
      </li>
    </ul>
    <mu-list>
      <mu-sub-header inset="">Folders</mu-sub-header>
      <mu-list-item v-for="(nickname, index) in list" :key="nickname" title="nickname" describetext="Jan 9, 2014">
        <mu-avatar icon="folder" slot="leftAvatar">
          <mu-icon value="info" slot="right">
          </mu-icon>
        </mu-avatar>
      </mu-list-item>
    </mu-list>
  </filterlist>
</Page>
</template>

<script>
export default {

  /**
   * 默认数据
   */
  data: function() {
    return {
      list: [],
      showFilter: false,
      filterOptions: [
        {
          title: '负责人',
          key: 'empl',
          type: 'employee', // 人员选择(employee),  部门选择（department）
          default: '',
          list: [
            {
              key: '金明',
              value: 'dingId-1'
            },
            {
              key: '罗志华',
              value: 'dingId-2'
            }
          ]
        }, {
          title: '部门',
          key: 'department',
          type: 'department', // 人员选择(employee),  部门选择（department）
          default: '',
          list: [
            {
              key: '产品部',
              value: 'dep-1'
            },
            {
              key: '研发部',
              value: 'dep-2'
            }
          ]
        }, {
          title: '交货日期',
          key: 'deliveryDate',
          type: 'dateange', // 时间范围
          multipe: true,
          default: ['currentQ'],
          list: [
            {
              key: '本周',
              value: 'currentWeek'
            },
            {
              key: '本月',
              value: 'currentMonth'
            },
            {
              key: '本季度',
              value: 'currentQ'
            },
            {
              key: '今天',
              value: 'today'
            },
            {
              key: '昨天',
              value: 'yesterday'
            }
          ]
        }, {
          title: '合同金额',
          key: 'contractAmount',
          type: 'numberRange', // 数字范围
          categories: [
            {
              key: '千级',
              value: [1, 999]
            },
            {
              key: '千级',
              value: [1000, 9999]
            },
            {
              key: '万级',
              value: [10000, 99999]
            },
            {
              key: '十万级',
              value: [100000, 999999]
            },
            {
              key: '百万级',
              value: [1000000, 9999999]
            }
          ],
          default: [1000, 9999]
        }, {
          title: '订单状态',
          key: 'orderStatus',
          type: 'normal', // 普通选项
          list: [
            {
              key: '不限',
              value: 'all'
            },
            {
              key: '已生效',
              value: '1'
            },
            {
              key: '未生效',
              value: '2'
            },

            {
              key: '已完成',
              value: '3'
            }
          ],
          default: 'all'
        }
      ],
      filterParams: {
        a: 1,
        b: 2
      }
    };
  },

  created() {}
}

</script>

<style lang="less" scoped="scoped">
ul {
  // 商机列表
  .business {
    border-bottom: .1rem solid #EBEBEB;
    display: flex;
    justify-content: space-between;
    line-height: 2rem;
    padding: 2rem;
    div:nth-child(1) {
      p:nth-child(1) {
        font-size: 1.4rem;
        color: #1C1C1C;
      }
      p:nth-child(2) {
        font-size: 1.1rem;
        color: #9B9B9B;
      }
    }
    div:nth-child(2) {
      font-size: 1.5rem;
      color: #747474;
    }
  }
  //线索列表
  .clue {
    border-bottom: .1rem solid #EBEBEB;
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    line-height: 2rem;
    div:nth-child(1) {
      p:nth-child(1) {
        font-size: 1.4rem;
        color: #1C1C1C;
      }
      p:nth-child(2) {
        font-size: 1.1rem;
        color: #9B9B9B;
      }
    }
    div:nth-child(2) {
      color: #FF1B43;
      font-size: 1rem;
    }
  }
  //客户列表  合作伙伴列表
  .client {
    border-bottom: .1rem solid #EBEBEB;
    padding: 2rem;
    line-height: 2rem;
    p:nth-child(1) {
      font-size: 1.4rem;
      color: #1C1C1C;
    }
    p:nth-child(2) {
      font-size: 1.1rem;
      color: #9B9B9B;
    }
  }
  //合同
  .contract {
    border-bottom: .1rem solid #EBEBEB;
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    line-height: 2rem;
    div:nth-child(1) {
      font-size: 1.4rem;
      p:nth-child(1) {
        color: #4A4A4A;
      }
      p:nth-child(2) {
        color: #9B9B9B;
      }
    }
    div:nth-child(2) {
      color: #9B9B9B;
      font-size: 1.1rem;
      p:nth-child(2) {
        text-align: center;
        color: #3B7CEC;
        line-height: 1.8rem;
        border-bottom: 0.1rem solid #3B7CEC;
        border-radius: .4rem;
      }
    }
  }
  //订单
  .order {
    border-bottom: .1rem solid #EBEBEB;
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    line-height: 2.2rem;
    color: #9B9B9B;
    div:nth-child(1) {
      font-size: 1.4rem;
      p:nth-child(1) {
        color: #4A4A4A;
      }
    }
    div:nth-child(2) {
      color: #9B9B9B;
      font-size: 1.1rem;
      p:nth-child(2) {
        text-align: center;
        color: #3B7CEC;
        border-bottom: 0.1rem solid #3B7CEC;
        border-radius: .4rem;
        line-height: 1.8rem;
        margin-top: 2.2rem;
      }
    }
  }
}
</style>
