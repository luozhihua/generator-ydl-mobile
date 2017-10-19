<template>
  <div class="searchList" ref="searchList">
    <div @click="handleOpen" class="searchList_select_box">
      <div class="zhezhao"></div>
      <mu-text-field :label="title" :helpTextClass="helpTextClass" v-validate
                     :required="true" type="text" v-model="btnTxt "
                     class="yd-icon yd-triangledownfill searchList_select_btn"
                     :errorText="errorText" disabled/>
    </div>

    <mu-dialog :open="open" @close="handleClose" dialogClass="dialogBbox searchList-box">
      <mu-text-field hintText="请输入关键字" @blur.stop="focus()" @keyup.stop="focus()" @keyenter.stop="focus()"
                     @keydown.stop="focus()" class="searchTxt" ref="searchTxt" v-model="searchTxt"
                     style="display: block; margin: auto"/>
      <div class="searchList_scroll">
        <mu-list>
          <mu-list-item v-for="item,index in selectOptionsTemp" :class="{'active':index==parseInt(value) }"
                        :value="String(index)"
                        :key="index" :title="String(item.key)" @click.stop="handleChange(index)"/>
        </mu-list>
        <infinite-loading :on-infinite="infiniteLoad" ref="infinite">
          <span slot="no-more">暂时没有更多数据</span>
        </infinite-loading>


      </div>

    </mu-dialog>

  </div>

</template>
<script>
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    NAME: 'searchList',
    components: {InfiniteLoading},
    props: {
      errorText: {type: String},
      selectId: {type: String},
      options: {type: Object},
      title: {type: String},
      disabled: {type: Boolean},
      required: {type: Boolean, default: true},
      searchListData: {type: [Array]}
    },
    data() {
      return {
        helpTextClass: '',
        searchTxt: '',
        btnTxt: '请选择',
        btnId: '',
        value: '',
        titles: '',
        open: false,
        disableds: false,
        pageSize: 10,
        currentPage: 0,
        selectOptionsTemp: [],
        //  list:this.searchListData
      }

    },
    watch: {
      errorText(val) {
        if (val.length > 0) {
          this.disableds = false;
          this.helpTextClass = 'helpClass';
        } else {
          this.disableds = true;
          this.helpTextClass = '';
        }
      },
      searchListData(n, o) {
        // console.log(n,o)
        this.beginSet();
      },
      searchTxt() {
        this.setIndex();
        this.selectOptionsTemp = [];
        this.searchListData.filter((item) => {
          if (item.key) {
            if (item.key.toLowerCase().indexOf(this.searchTxt.toLowerCase()) > -1) {
              this.selectOptionsTemp.push(item)
            }
          }
        })
      },
      selectId(val) {

        this.beginSet()
      },
      value(val) {
        this.setIndex();
      }
    },
    computed: {
      searchResutle() {
        let that = this;

        return this.searchListData.filter(function (item) {
          return item.key.toLowerCase().indexOf(that.searchTxt.toLowerCase()) !== -1
        })

      }
    },
    created() {
      //  console.log(this.disabled)
      if (this.errorText.length > 0) {
        this.disableds = false;
        this.helpTextClass = 'helpClass';
      } else {
        this.disableds = true;
        this.helpTextClass = '';
      }
      this.beginSet();
    },
    methods: {
      focus() {
        this.$refs.searchTxt.focus();
      },
      beginSet() {
        let flag = '';

        for (let i = 0; i < this.searchResutle.length; i++) {
          if (this.searchResutle[i].id === (this.selectId)) {
            flag = i;
            break;
          }
        }
        //  console.log(flag,this.selectId,this.searchResutle)
        if (flag !== '') {
          this.value = flag;
          this.btnId = this.searchResutle[flag].id;
          this.btnTxt = this.searchResutle[flag].key;
        } else {
          this.value = '';
          this.btnTxt = '请选择';
        }
      },
      setIndex() {
        let flag = '';

        for (let i = 0; i < this.searchResutle.length; i++) {
          if (this.btnId === this.searchResutle[i].id) {
            flag = i;
            break;
          }
        }
        if (flag !== '') {
          this.value = flag;
          this.btnId = this.searchResutle[flag].id;
          this.btnTxt = this.searchResutle[flag].key;
        } else {
          this.value = '';
          this.btnTxt = '请选择';
        }

      },
      async infiniteLoad() {
        this.selectOptionsTemp = [];
        //if (this.searchResutle.length == 0 ) return;
        this.currentPage += 1;
        let data = [];

        for (let i = 0; i < this.searchResutle.length; i++) {
          if (i < this.currentPage * this.pageSize) {
            this.selectOptionsTemp.push(this.searchResutle[i]);
          } else {
            break;
          }
        }
        data = this.selectOptionsTemp;
        // 通知分页组件加载完成
        this.$refs.infinite.$emit('$InfiniteLoading:loaded')
        // 没有更多数据时通知加载组件

        if (data.length >= this.searchResutle.length) {
          this.$refs.infinite.$emit('$InfiniteLoading:complete')
        }

      },
      handleChange(val) {
        this.open = false
        this.value = val;
        this.btnTxt = this.searchResutle[val].key;
        this.btnId = this.searchResutle[val].id;
        this.$emit('getSearchListData', {
          id: this.btnId,
          key: this.btnTxt
        });
        this.errorText = '';
      },
      handleOpen(e) {
        if (this.disabled) return;
        this.open = true;
        this.$nextTick(() => {
          this.currentPage = 0;
          this.$refs.infinite.$emit('$InfiniteLoading:reset');
          this.infiniteLoad();
        });
      },
      handleClose() {
        this.open = false
      }

    },

    beforeDestroy() {

    },
    destroy() {

    }

  }
</script>
<style lang="less" scoped="less">
  .searchList {
    position: relative;
    .searchList_select_box {
      width: 100%;
      position: relative;
      .zhezhao {
        width: 100%;
        height: 4rem;
        position: absolute;
        bottom: 0;
        z-index: 2;
      }

      .mu-text-field.disabled .mu-text-field-content .mu-text-field-input {
        color: #747474;
      }
    }
    .searchList_select_btn {
      width: 100%;
      left: 0;
      &:before {
        position: absolute;
        right: 1rem;
        bottom: 2rem;
        font-size: 1.2rem
      }
    }
  }

  .searchList_scroll {
    max-height: calc(89vh);
    overflow-x: hidden;
    overflow-y: scroll;
    border-radius: 0.5rem;
    .active {
      background: #f4f4f4;
      .mu-menu-item-wrapper {
        .mu-menu-item-title {
          color: #0a6aa1;
        }
      }
    }
    .mu-item {
      height: 3rem
    }
  }

  .searchTxt {
    width: 90%;
    padding: 0.5rem 0 0.5rem;
    height: 3rem;
    overflow: hidden;
  }


</style>
<style>
  .searchList-box {
    width: 85%
  }

  .searchList .mu-text-field.disabled .mu-text-field-content {
    color: #d5d5d5;
    font-size: 16px;
  }

  .searchList .mu-text-field.disabled .mu-text-field-content .mu-text-field-input {
    color: #747474;
  }

  .helpClass {
    border-top: 2px solid #f44336;
    margin: 0;
    padding-top: 6px;
  }
</style>
