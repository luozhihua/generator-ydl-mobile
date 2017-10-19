<template>
  <div class="singleSeltectors">
    <mu-dialog :open="open" @close="close" dialogClass="dialogBbox dialogBbox_input_box" :title="String(title)">

      <div class="dialogBbox_input_box">
        <input class="dialogBbox_input" v-model="searchDialog" labelLeft placeholder="请输入搜索内容">
      </div>
      <div class="dialogBbox_input_body">
        <mu-list-item disableRipple
                      v-for="menu, index in filterMenusTemp "
                      :key="menu.value"
                      @click=" isDisabled(menu)"
                      :title="String(menu.key)"
                      :style="{'opacity':menu.disabled ? '0.7' : 1}">
          <mu-radio label="" name="dialogRadio" :nativeValue="String(menu.value)" v-model="dialogRadio"
                    class="demo-radio"
                    :disabled="menu.disabled" slot="right"/>
        </mu-list-item>
        <infinite-loading :on-infinite="infiniteLoad" ref="infinite">
          <span slot="no-more">暂时没有更多数据</span>
        </infinite-loading>
      </div>
      <mu-flat-button primary label="关闭" @click="close" slot="actions"/>
      <mu-flat-button primary label="确定" @click="dialogSubmit" slot="actions"/>
    </mu-dialog>
  </div>
</template>
<script>
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    NAME: 'singleSelectors',
    components: {InfiniteLoading},
    props: {
      title: {type: [String]},
      singleOpen: {type: Number},
      singleData: {type: Array},
      dialogSingleSubmit: {type: [Object, Function]},
      singleSelectId: {type: String},

    },
    data() {
      return {
        open: false,
        dialogRadio: String(this.singleSelectId),
        searchDialog: '',
        filterMenus: [],
        filterMenusTemp: [],
        pageSize: 10,
        currentPage: 0,
      }

    },
    watch: {
      singleOpen(val) {
        this.open = true;
        this.$nextTick(() => {
          this.currentPage = 0;
          this.$refs.infinite.$emit('$InfiniteLoading:reset');
          this.infiniteLoad()
        });
      },
      singleData() {
        this.filterMenus = this.singleData;
        this.$nextTick(() => {
          this.currentPage = 0;
          this.$refs.infinite.$emit('$InfiniteLoading:reset');
          this.infiniteLoad()
        });
      },
      searchDialog() {

        this.filterMenus = [];
        this.singleData.filter((item) => {
          if (item.key) {
            if (item.key.toLowerCase().indexOf(this.searchDialog.toLowerCase()) > -1) {
              this.filterMenus.push(item)
            }
          }
        })
        this.filterMenusTemp = this.filterMenus;
      },
    },
    computed: {},
    created() {
      this.filterMenus = this.singleData;
    },
    methods: {
      async infiniteLoad() {
        let data = [];

        this.filterMenusTemp = [];
        this.currentPage += 1;

        if (this.filterMenus.length !== 0) {

          for (let i = 0; i < this.filterMenus.length; i++) {
            if (i < this.currentPage * this.pageSize) {
              this.filterMenusTemp.push(this.filterMenus[i]);
            } else {
              break;
            }
          }

          data = this.filterMenusTemp;
        }
        // 通知分页组件加载完成
        this.$refs.infinite.$emit('$InfiniteLoading:loaded')
        // 没有更多数据时通知加载组件
        if (data.length >= this.filterMenus.length) {
          this.$refs.infinite.$emit('$InfiniteLoading:complete')
        }

      },
      close() {
        this.open = false;
        this.$emit('singleOpen', false);
      },
      dialogSubmit() {
        let key = '', index = 0;

        for (let i in this.singleData) {
          if (this.singleData[i].value === this.dialogRadio) {
            key = this.singleData[i].key;
            index = i;
            break
          }
        }
        console.log(this.dialogRadio)
        this.$emit('getSingleData', {
          value: this.dialogRadio,
          key: key,
          index: index
        });
        if (this.dialogSingleSubmit) {this.dialogSingleSubmit();}
        this.open = false;

      },
      isDisabled(menu) {
        if (!menu.disabled) {
          this.dialogRadio = String(menu.value);
        }
      }
    },

    beforeDestroy() {

    },
    destroy() {

    }

  }
</script>
<style lang="less" scoped="less">
</style>
