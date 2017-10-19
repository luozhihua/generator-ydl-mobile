<template>
  <Page title="选择器">

    <Panel>
      <h2 slot="header-left">下拉选择器</h2>

      <Selector
        multipe
        icon="yd-arrow-down"
        placeholder="请选择"
        textAlign="left"
        v-model="valueAA"
        @click="selectClick"
      ></Selector>
      <pre>选中：{{ valueAA }}</pre>
    </Panel>

    <Panel>
      <h2 slot="header-left">下拉选择器</h2>

      <Selector
        icon=""
        placeholder="请选择"
        textAlign="left"
        :options="selectOptions"
        v-model="valueA"
      ></Selector>

      <pre>选中：{{ valueA }}</pre>
    </Panel>

    <Panel>
      <h2 slot="header-left">下拉选择器(多选)</h2>

      <Selector
        multipe
        icon=""
        placeholder="请选择"
        textAlign="left"
        multipe
        :options="selectOptions"
        v-model="defaultKeys"
      ></Selector>

      <pre>选中：{{ defaultKeys }}</pre>
    </Panel>


    <panel>
      <h2 slot="header-left">产品选择器（羊肉串）</h2>
      <product-selector :autoOpen="false" v-model="products" :options="productOptions">
        <i class="yd-icon yd-grid"></i> 选择产品
      </product-selector>
      <pre>{{ JSON.stringify(products, 2, 2) }}</pre>
    </panel>

    <Panel>
      <h2 slot="header-left">产品选择器（自动打开）</h2>
      <ProductSelector :autoOpen="true" v-model="products" :options="productOptions">
        <i class="yd-icon yd-grid"></i> 选择产品
      </ProductSelector>
      <pre>{{ JSON.stringify(products, 2, 2) }}</pre>
    </Panel>


    <Panel>
      <h2 slot="header-left">产品选择器(无标题)</h2>
      <ProductSelector :title="false" v-model="products" :options="{title: false}">
        <i class="yd-icon yd-grid"></i> 选择产品
      </ProductSelector>
      <pre>{{ JSON.stringify(products, 2, 2) }}</pre>
    </Panel>


    <Panel>
      <h2 slot="header-left">产品选择器(单选)</h2>
      <ProductSelector :title="false" v-model="products" :options="{title: false, multipe: false}">
        <i class="yd-icon yd-grid"></i> 选择产品
      </ProductSelector>
      <pre>{{ JSON.stringify(products, 2, 2) }}</pre>
    </Panel>


    <Panel>
      <h2 slot="header-left">合同、订单产品选择器</h2>
      <ProductContract v-model="contractProducts" :options="contractProductOptions">
        <i class="yd-icon yd-grid"></i> 选择订单的产品
      </ProductContract>
      <pre>{{ JSON.stringify(contractProducts, 2, 2) }}</pre>
    </Panel>


    <Panel>
      <h2 slot="header-left">部门选择器</h2>
      <OrgSelector v-model="orgs" type="organization"
                   :options="orgSelectOptions"
                   :multipe="true"
                   :max="100"
                   :selectedDepartments="[]"
                   :requiredDepartments="[]"
                   :disabledDepartments="[]"
                   :selectedUsers="[]"
                   :requiredUsers="[]"
                   :disabledUsers="[]">
        <i class="yd-icon yd-user"></i> 选择部门
      </OrgSelector>
      <pre>{{ JSON.stringify(orgs, 2, 2) }}</pre>
    </Panel>

    <Panel>
      <h2 slot="header-left">人员选择器</h2>
      <OrgSelector v-model="users" multipe type="employee" :options="userSelectOptions">
        <i class="yd-icon yd-user"></i> 选择人员
      </OrgSelector>
      <pre>{{ JSON.stringify(users, 2, 2) }}</pre>
    </Panel>

    <Panel>
      <h2 slot="header-left">部门和人员选择器</h2>

      <OrgSelector v-model="orgUsers" multipe type="all" :options="orgEmplSelectOptions">
        <i class="yd-icon yd-user"></i> 选择部门和人员
      </OrgSelector>

      <pre>{{ JSON.stringify(orgUsers, 2, 2) }}</pre>
    </Panel>

    <Panel>
      <h2 slot="header-left">单弹框可选1</h2>

      <mu-raised-button label="scrollable dialog" @click="singleOpen++"/>
      <singleSelectors title="String(单选框)" :singleOpen="singleOpen" :singleData="singleData"
                       :singleSelectId="String(singleSelectId)"
                       v-on:getSingleData="getSingleData" :dialogSingleSubmit="dialogSingleSubmit"
      ></singleSelectors>

      <pre>{{ dialogRadioTxt ? '已选择' + dialogRadioTxt : '[]' }}</pre>
    </Panel>


    <Panel>
      <h2 slot="header-left">多弹框可选</h2>

      <mu-raised-button label="scrollable dialog" @click="dialogCheckboxOpen"/>

      <mu-dialog :open="dialogCheckbox" @close="dialogCheckboxClose"
                 dialogClass="dialogBbox dialogBbox_input_box"
                 title="弹框标题">
        <div class="dialogBbox_input_box"><input class="dialogBbox_input" v-model="searchDialogBox" labelLeft
                                                 placeholder="请输入搜索内容"></div>

        <mu-checkbox :label="dialogCheckAll? '反选' : '全选'" v-model="dialogCheckAll" class="select-more-checkbox"
                     labelLeft/>
        <div class="dialogBbox_input_body">
          <mu-list-item
            v-for="item,index in filterDialogCheckbox"
            :key="item+index"
          >
            <mu-checkbox :label="item" :nativeValue="item" class="demo-checkbox" v-model="dialogCheckboxModel"
                         labelLeft/>
          </mu-list-item>
        </div>
        <mu-flat-button primary label="关闭" @click="dialogCheckboxClose" slot="actions"/>
        <mu-flat-button primary label="确定" @click="dialogCheckboxSubmit" slot="actions"/>
      </mu-dialog>

      <pre>{{ dialogCheckboxTxt ? '已选择' + dialogCheckboxTxt : '[]' }}</pre>
    </Panel>


    <Panel>
      <h2 slot="header-left">搜索下拉</h2>

      <searchList :searchListData="searchListData" :errorText="searchListErrorText" selectId=""
                  :disabled="searchListDisabled" title="行业标签" :options="searchListOptions"
                  v-on:getSearchListData="getSearchListData"></searchList>
      <pre>{{ '已选择id:' + searchListSelectData.id + ' key:' + searchListSelectData.key}}</pre>
    </Panel>


  </Page>
</template>

<script>
  import searchList from '../../components/searchList/searchList'
  import singleSelectors from '../../components/searchSelectors/singleSelectors'

  export default {
    /**
     * 默认数据
     */
    components: {
      searchList, singleSelectors
    },
    data: function () {
      let serviceId = this.$route.query.id

      return {
        singleOpen: 0,
        singleSelectId: 2,
        dialogSingleSubmit() {
          console.log(111)
        },
        singleData: [
          {key: '乔峰', value: 1},
          {key: '段誉', value: 2, disabled: true},
          {key: '虚竹3', value: 3},
          {key: '虚竹4', value: 4},
          {key: '虚竹5', value: 5},
          {key: '虚竹6', value: 6},
          {key: '虚竹7', value: 7},
          {key: '虚竹8', value: 8},
          {key: '虚竹9', value: 9},
          {key: '虚竹10', value: 10},
          {key: '虚竹11', value: 11},
          {key: '虚竹12', value: 12},
          {key: '虚竹13', value: 13},
          {key: '虚竹14', value: 14},
          {key: '虚竹15', value: 15},
          {key: '虚竹16', value: 16},
          {key: '虚竹17', value: 17},
          {key: '虚竹18', value: 18},
          {key: '虚竹19', value: 19},
          {key: '虚竹20', value: 20},
          {key: '虚竹21', value: 21}
        ],
        searchListDisabled: false,
        searchListSelectData: {id: '', key: ''},
        searchListOptions: {},
        searchListErrorText: '',
        searchListData: [
          {key: 'q', id: 8},
          {key: 'AQ', id: 3},
          {key: 'qq', id: 1},
          {key: 'qqbb', id: 2},
          {key: 'bb', id: 4},
          {key: 'dd', id: '6s'},
          {key: 'ccbb', id: 5},
        ],
        valueA: 0,
        defaultKeys: [
          {key: '乔峰', value: 1},
          {key: '段誉', value: 2, disabled: true},
          {key: '虚竹3', value: 3},
          {key: '虚竹4', value: 4},
          {key: '虚竹5', value: 5},
          {key: '虚竹6', value: 6}
        ],
        valueAA: 0,
        selectOptions: [
          {key: '乔峰', value: 1},
          {key: '段誉', value: 2, disabled: true},
          {key: '虚竹3', value: 3},
          {key: '虚竹4', value: 4},
          {key: '虚竹5', value: 5},
          {key: '虚竹6', value: 6},
          {key: '虚竹7', value: 7},
          {key: '虚竹8', value: 8},
          {key: '虚竹9', value: 9},
          {key: '虚竹10', value: 10},
          {key: '虚竹11', value: 11},
          {key: '虚竹12', value: 12},
          {key: '虚竹13', value: 13},
          {key: '虚竹14', value: 14},
          {key: '虚竹15', value: 15},
          {key: '虚竹16', value: 16},
          {key: '虚竹17', value: 17},
          {key: '虚竹18', value: 18},
          {key: '虚竹19', value: 19},
          {key: '虚竹20', value: 20},
          {key: '虚竹21', value: 21}
        ],
        list: [],
        products: [],
        contractProducts: [],

        orgs: [],
        users: [],
        orgUsers: [],
        productOptions: {
          title: '选择产品',
          type: 'product' // product | category | all
        },
        contractProductOptions: {
          title: '选择订单产品',
          url: `/api/contract/queryContractProductList?serviceType=0&serviceId=${serviceId}`
        },
        orgSelectOptions: {
          title: '选择部门'
        },
        userSelectOptions: {
          title: '选择人员',
          selectedUsers: ['userId1', 'userId2'],
          disabledUsers: ['userId1', 'userId2']
        },
        orgEmplSelectOptions: {
          title: '选择部门和人员'
        },
        dialog: false,
        dialogRadio: '你好',
        dialogRadioTxt: '你好',
        searchDialog: '',
        menus: ['你好', '他好11', '我好11', 'm311', 'm411', 'm5', 'm611', 'm711'],
        dialogCheckAll: false,
        searchDialogBox: '',
        dialogCheckbox: false,
        dialogCheckboxTxt: '',
        dialogCheckboxModel: [],
        dialogCheckboxData: ['你好', '他好11', '我好11', 'm311', 'm411', 'm5', 'm611', 'm711'],
      }
    },

    watch: {
      //设置高度
      searchDialog() {

      },

      //监听全选按钮
      dialogCheckAll(flag) {
        if (flag) {
          this.dialogCheckboxModel = this.dialogCheckboxData
        } else {
          this.dialogCheckboxModel = [];
        }
      }
    },

    /**
     * 组件初始化钩子
     */
    async created() {
      let [res1, res2, res3] = await this.$ajax.seine([
        this.$ajax.get('/vue/data.json'),
        this.$ajax.get('/vue/datas-404.json'), // 404, b === null
        this.$ajax.get('/vue/data.json')
      ])

      this.game1 = 5;
      console.log(res1, res2, res3)

      this.init()
    },

    /**
     * 当前页面能调用的方法
     */
    methods: {
      getSingleData(val) {
        console.log(val);
      },
      getSearchListData(val) {
        console.log(val);
        this.searchListSelectData = val;
        this.searchListErrorText = '';
      },
      init: async function () {
      },

      selectClick() {
        alert('clicked')
      },
      dialogOpen() {
        this.dialog = true;
        this.dialogRadio = this.dialogRadioTxt;
      },
      dialogClose() {
        this.dialog = false
      }, close() {
        this.dialog = false
      },
      dialogSubmit() {
        this.dialogRadioTxt = this.dialogRadio
        this.dialog = false;

      },

      dialogCheckboxOpen() {
        this.dialogCheckbox = true;
      },
      dialogCheckboxClose() {
        this.dialogCheckbox = false;
      },
      dialogCheckboxSubmit() {
        this.dialogCheckboxTxt = this.dialogCheckboxModel
        this.dialogCheckbox = false;
      }

    },
    computed: {
      //单选按钮搜索
      filterMenus: function (value) {
        let searchDialog = this.searchDialog;
        let menus = this.menus;

        return menus.filter(function (item) {
          return item.toLowerCase().indexOf(searchDialog.toLowerCase()) !== -1
        });
      },
      filterDialogCheckbox(value) {
        let searchDialogBox = this.searchDialogBox;
        let dialogCheckboxData = this.dialogCheckboxData;

        return dialogCheckboxData.filter(function (item) {
          return item.toLowerCase().indexOf(searchDialogBox.toLowerCase()) !== -1
        });

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
