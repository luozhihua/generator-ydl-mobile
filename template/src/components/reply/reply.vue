<template>
  <div class="reply-input-box">
    <div class="reply-input comments-animation " v-if="queryParms.isRely>0">
      <form action="#" @submit.prevent v-auto-focus="0" :data-current="0">
        <div class="reply-input-content">
          <div class="input" @click="inputFocus()">
            <input data-index="0" :placeholder="queryParms.replyName ? '回复'+queryParms.replyName+' :' : '请输入回复内容'"
                   @click="inputFocus()" @keyup.13="openNew('top')" id="replay_box" type="text"
                   name="hf_txt" @blur="replyBlurFuc" ref="replyFocus" v-model="message">
          </div>
          <div class="btn-group">
            <!-- <input type="button" class="send" value="发送" @click="openNew('top')"> -->
            <div class="send" @click.stop="openNew('top')">发送</div>
          </div>
        </div>
      </form>
    </div>

    <mu-popup position="top" :overlay="false" popupClass="comment-popup-top-txt" :open="topPopup">
      {{errorMessage}}
    </mu-popup>
  </div>

</template>
<script>
  export default {
    /**
     * 默认数据
     */
    props: {
      queryParms: {type: Object}
    },
    data: function () {
      return {
        message: '',
        errorMessage: '',
        topPopup: false,
        isFocus: false,
        clickFlag: false
      }
    },

    /**
     * 组件初始化钩子
     */
    created: function () {

    },
    mounted() {
      this.touchmove();
    },

    /**
     * 当前页面能调用的方法
     */
    watch: {
      'queryParms.isRely'(val) {
        this.isFocus = true;
        if (val > 0) {
          this.$nextTick(function () {
            this.$store.commit('hideNav');
            this.inputFocus();
          })
        }

      },
      topPopup(val) {
        if (val) {
          setTimeout(() => {
              this.topPopup = false
            },
            3000
          )
        }
      }
    },
    methods: {
      inputFocus() {
        this.$refs.replyFocus.focus();
        /*  setTimeout(function(){
           document.getElementById('replay_box').scrollIntoView(true);
          },1);*/
      },
      cancel() {
        history.back();
      },
      replyBlurFuc() {
        let that = this;
        setTimeout(function () {

          if (!that.clickFlag) {
            that.queryParms.isRely = 0;
            $('.comments-animation').show();
          }
        }, 100);
      },
      touchmove() {
        let that = this;
        document.body.ontouchmove = function () {

          that.queryParms.isRely = 0;
          $('.comments-animation').show();
          that.message = '';
        }
      },
      openNew(position) {

        if (this.message.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
          //this.$refs.replyFocus.focus();
          this.clickFlag = true;

          this.queryParms.isRely = 1;
          this.errorMessage = '输入内容不能为空';
          this.topPopup = true
        } else {
          console.log('成功')
          this.$ajax.post("/api/comment/saveComment", {
            moduleType: this.queryParms.moduleType,
            type: 1,
            replyId: this.queryParms.replyId,
            moduleId: this.queryParms.moduleId,
            content: this.message
          }).then(results => {
            this.queryParms.isRely = false;
            this.queryParms.success(results.data);
            this.message = '';
            this.clickFlag = false;
          })
          ;

        }

      },

    }
  }
</script>

<style lang="less" scoped="scoped">

  @import url('./reply.less');

</style>
<style lang="css">

  .comment-popup-top-txt {
    width: 100%;
    text-align: center;
    color: #fff;
    padding: 1rem 0;
    background: rgba(0, 0, 0, .5) !important;
  }
</style>
