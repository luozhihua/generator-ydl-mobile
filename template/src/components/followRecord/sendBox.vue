<template>

  <div class="comments-input comments-animation"
       v-if="$store.state.sendBox.isRely==0 && $store.state.sendBox.showFollow==1" :style="{'position':position}">
    <form action="#" @submit.prevent>
      <div class="input">
        <input type="text" placeholder="请输入" name="jl_txt" @keyup.13="open('top')" ref="gjjl" @blur="inputBlur"
               @focus="inputFocus" v-model="message ">
      </div>
      <div class="btn-group">
        <div class="send" @click="open('top')">发送</div>
        <div class="photo icon  xiangji" @click="goCamera"></div>

        <div class="goSign icon dingwei" @click="goSign"></div>
      </div>
    </form>
    <mu-popup position="top" :overlay="false" popupClass="comment-popup-top-txt" :open="topPopup">

      {{errorMessage}}
    </mu-popup>
  </div>


</template>
<script>
  import util from '../../utils/utils';

  export default {
    NAME: 'sendBox',
    components: {},
    props: {
      options: {type: Object},
      queryParms: {type: Object}
    },
    data() {
      return {
        message: '',
        errorMessage: '',
        topPopup: false,
        position: 'fixed',
        postTxtFlag: true,
        imgPath: ''
      }
    },
    watch: {
      topPopup(val) {
        if (val) {
          setTimeout(() => {
            this.topPopup = false
          }, 3000)
        }
      },
      '$store.state.frame.navVisible'(val) {
        if (val) {
          this.$store.commit('setSendBox', {isRely: 1});
        } else {
          this.$store.commit('setSendBox', {isRely: 0});
        }
      },

    },
    created() {
    },
    mounted: function () {

      this.load();
    },
    methods: {
      ... util,
      open(position) {
        if (this.message.replace(/(^\s*)|(\s*$)/g, "").length == 0 && this.imgPath.length == 0) {
          this.errorMessage = '请输入跟进记录';
          this[position + 'Popup'] = true
          return
        }
        this.postTxt();
      },
      close(position) {
        this[position + 'Popup'] = false
      },
      inputBlur() {
        this.position = 'fixed';
      },
      inputFocus() {
        this.position = 'absolute';
      },
      load() {

      },
      goCamera() {
        var that = this;
        dd.biz.util.uploadImage({
          multiple: false, //是否多选，默认false
          max: 3, //最多可选个数
          onSuccess: function (result) {
            //onSuccess将在图片上传成功之后调用
            // alert(JSON.stringify(result));
            that.imgPath = result[0];
            that.postTxt();

          },
          onFail: function (error) {
            //  alert(JSON.stringify(error));
          }
        })
      },
      postTxt() {
        let that = this;
        if (!this.postTxtFlag) return;
        this.postTxtFlag = false;
        //记录提交接口+'&'
        this.$ajax.post('/api/activity/addActivity?moduleId=' + this.$store.state.sendBox.moduleId + '&activityContent=' + this.message + '&moduleType=' + this.$store.state.sendBox.moduleType + '&moduleName=' + this.$store.state.sendBox.moduleName + '&activityType=7&filePath=' + this.imgPath
        ).then(results => {

          this.message = '';
          this.imgPath = '';

          // this.followRecordData();

          this.postTxtFlag = true;
          //若是线索，则更新线索状态为跟进中
          if (that.$store.state.sendBox.moduleType == 'clue') {
            that.$ajax.get("/api/clue/updateClueInfoToFollowing?id=" + that.$store.state.sendBox.moduleId);
          }
          that.$store.state.sendBox.callback(results.data);
          this.$refs.gjjl.blur();

          //window.location.reload();
        });

      },
      //签到
      goSign() {
        console.log(this.$store.state.sendBox);
        this.$page.show('/sign?type=1&moduleId=' + this.$store.state.sendBox.moduleId + '&moduleType=' + this.$store.state.sendBox.moduleType + '&moduleName=' + this.$store.state.sendBox.moduleName);
      }

    },
    computed: {},

    beforeDestroy() {

    },

  }
</script>
<style lang="less" scoped="">
  .comments-input {
    transform: translate3d(0, 0, 0);
    padding: 1rem;
    border-top: 1px solid #eee;
    overflow: hidden;
    position: fixed;
    min-height: 50px;
    bottom: 0;
    width: 100%;
    z-index: 999;
    background: #f6f6f6;

    form {
      display: flex;
    }

    .input {
      flex: 1;

      input {
        width: 110%;
        height: 9vw;
        font-size: 1.2rem;
        line-height: 9.15vw;
        border-radius: 0.5rem;
        border: 1px solid #ddd;
        background: #fff;
        -webkit-appearance: none;
        padding-left: 0.5rem;
      }

    }
    .btn-group {
      top: 3.8vw;
      width: 40vw;

      div {
        float: left
      }

      .photo {
        color: #3B7CEC;
        position: relative;
        overflow: hidden;
        margin: 0 3vw;
        width: 8vw;
        height: 8vw;
      }

      .send {
        background: #3B7CEC;
        color: #fff;
        line-height: 9vw;
        width: 15vw;
        text-align: center;
        margin-right: 1vw;
        border-radius: 0 0.5rem 0.5rem 0;
      }

      .goSign {
        color: #3B7CEC;
        position: relative;
        width: 8vw;
        height: 8vw;
      }

    }
  }

  .comments-animation {
    -webkit-animation-name: slideInUp;
    -moz-animation-name: slideInUp;
    -o-animation-name: slideInUp;
    animation-name: slideInUp;
    -webkit-animation-duration: .3s;
    -moz-animation-duration: .3s;
    -o-animation-duration: .3s;
    animation-duration: .3s;
    -webkit-animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    -moz-animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    -o-animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 1);

  }

</style>
<style lang="css">
  .comment-popup-top-txt {
    width: 100%;
    text-align: center;
    color: #fff;
    padding: 1rem 0;
    background: rgba(0, 0, 0, .5) !important;
  }

  .ac {
    font-size: 1.6rem;
  }
</style>
