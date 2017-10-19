<template>

  <transition name="js-followRecord">
    <div class="followRecord" :class="{ 'follow-up-record-style2': queryParms.style=='2' }">
      <div>
        <div class="follow-up-record">

          <div class="title" v-if="queryParms.titleShow!='hide'">跟进纪录</div>
          <!-- ---------跟进评论 start ---------->
          <div class="record-list" v-for="(activity,index) in replyParms.parentData" :key="activity.name">
            <div class="record-head">
              <img :src="activity.userAvatar || '/images/male_avatar.png'">
              <div>
                <p>{{activity.name}}</p>
                <!--  <p>销售部-华东区B部</p> -->
              </div>
              <span>{{formatDate(activity.createTime, 'MM/DD HH:mm')}}</span>
            </div>
            <div class="record-content">
              <!-- <p><span>客户名称: </span><span>上海普华永道科技有限公司</span></p> -->
              <p>{{activity.activityContent}}</p>
              <p v-if="activity.activityType == 2" class="mt_2"><i class="ac yd-icon yd-dingweixiao"/>{{activity.poi}}
              </p>
              <p class="img-list"><img v-for="(item,index) in activity.filePaths" :key="item" @click="showBig(item)"
                                       :src="item"></p>
            </div>
            <div class="record-like">
              <i v-if="isUpdateFuc(activity.createTime,activity.activityType)" class="yd-icon yd-dingdan1"
                 @click="goEdit(activity)"></i>
              <div @click="fabulous(activity,index)">
                <i class="yd-icon " :class="isFabulous(activity)"></i>
                <span> {{activity.comments ? activity.comments.approvalTimes : 0}}  </span>
              </div>
              <div class="comment-ico" @click="goComments(activity.id)"><i
                class="icon pinglun"></i><span> {{activity.comments.commentTimes}} </span>
              </div>
            </div>
            <div class="record-comment" v-if="activity.comments.commentTimes>0">
              <p>共<span>{{activity.comments.commentTimes}}</span>条评论</p>
              <ul>
                <li v-for="(comment,index) in activity.comments.commentList"
                    v-if=" replyParms.showReplyAll(index)|| activity.showReplyIco" :key="comment.id"
                    @click="goComments(activity.id,comment.createdId,comment.createdName)">

                  <span v-if="comment.replyName &&　comment.replyId">
                        <span class="color">{{comment.createdName}} </span> 回复 <span class="color"> {{comment.replyName}} : </span><span>{{comment.content}}</span>
                      </span>
                  <span v-else>
                        <span class="color">{{comment.createdName}}: </span> <span>{{comment.content}}</span>
                      </span>
                  <!--  <span>{{comment.createdName}}:</span>
                    <span>{{comment.content}}</span>
                    -->
                </li>
              </ul>
              <p @click="showReplyMore(index)" v-if="activity.comments.commentTimes>3">{{activity.showReplyText ||
              '查看全部动态'}}<span class="yd-icon "
                              :class="{'yd-arrow-down':!activity.showReplyIco,'yd-arrow-up':activity.showReplyIco}"></span>
              </p>
            </div>
          </div>
          <!-- ---------跟进评论 end --------- -->
        </div>

        <infinite-loading @infinite="infiniteLoad" ref="infinite">
          <span slot="no-more">- 没有更多了 -</span>
        </infinite-loading>

        <reply :queryParms="replyParms"></reply>
      </div>
      <div>

      </div>
    </div>

  </transition>
</template>
<script>
  import util from '../../utils/utils';
  import reply from '../../components/reply/reply';
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    NAME: 'followRecord',
    components: {
      reply, InfiniteLoading
    },
    props: {
      options: {type: Object},
      queryParms: {type: Object}

    },
    data() {
      return {
        isLoading: false,
        currId: '',
        activitys: [],
        message: '',
        replyMessage: '',
        imgPath: '',
        errorMessage: '',
        topPopup: false,
        pageSize: 10,
        currentPage: 0,
        postTxtFlag: true,
        timeSet: '',
        replyParms: {
          isRely: 0,
          replyId: '',
          replyName: '',
          moduleType: 'activity',
          showReplyAll: function (index) {
            let flag = false;
            if (index < 3) flag = true;
            return flag;
          },
          type: '1',
          moduleId: '',
          parentData: [],
          success: function (data) {
            let index = 0;
            for (let i = 0, o; o = this.parentData[i]; i++) {
              if (o.id == this.moduleId) {
                this.parentData[i].showReplyIco = true;
                this.parentData[i].comments.commentList = this.parentData[i].comments.commentList.concat(data);
                this.parentData[i].comments.commentTimes++;
                this.parentData[i].showReplyText = '收起';
                break;
              }
            }
            this.isRely = 0;
            $('.comments-animation').show();

          }
        },
        fabulousFlag: true,
        isFabulous(item) {
          //{'yd-xihuan1':currId!=activity.id,'yd-xihuan': activity.id==currId}
          let classes = 'yd-xihuan1';
          if (item.comments) {
            for (let i in item.comments.approvalList) {
              if (item.comments.approvalList[i].createdId == this.currId) {
                classes = 'yd-xihuan';
                break;
              }
            }
          }
          return classes;
        }
      }
    },
    watch: {
      'queryParms.refresh'(val) {

        this.currentPage = 0;
        this.$refs.infinite.$emit('$InfiniteLoading:reset');
        //this.infiniteLoad();
        this.replyParms.parentData = [];
        this.activitys = this.replyParms.parentData;
      },
      'queryParms.moduleName'(val) {

        this.$store.commit('setSendBox',
          {
            moduleName: encodeURIComponent(val)
          });
      }
    },

    created() {
      this.getCurrentUserDetailInfo();
      this.load();
    },
    mounted: function () {
      let that = this;

      this.$store.commit('setSendBox',
        {
          isRely: 0,
          showFollow: 1,
          moduleId: this.queryParms.moduleId,
          moduleType: this.queryParms.moduleType,
          callback: () => {

            this.currentPage = 0;
            this.$refs.infinite.$emit('$InfiniteLoading:reset');
            this.replyParms.parentData = [];
            this.activitys = this.replyParms.parentData;
          }
        });
      console.log(this.$store.state.sendBox, this.$store.state.sendBox.isRely);

    },
    methods: {
      ... util,
      open(position) {
        let isTextEmpty = this.message.replace(/^\s*$/g, '') === ''

        if (isTextEmpty && this.imgPath.length === 0) {
          this.errorMessage = '请输入跟进记录';
          this[position + 'Popup'] = true
          return
        }
        this.postTxt();
      },
      close(position) {
        this[position + 'Popup'] = false
      },
      load() {
        this.getUpdateTime();
      },
      async getUpdateTime() {
        let data = await this.$ajax.get('/api/dict/selectValueByKey?dicKey=Activity.EditableTime');

        this.timeSet = data.data.dicValue;
      },
      isUpdateFuc(t, type) {
        let old = new Date(t).getTime()
        let now = new Date().getTime()

        if (type !== 7 && type !== 2) {
          return false;
        }

        if ((old + this.timeSet * 60 * 1000) > now) {
          return true;
        } else {
          return false;
        }
      },

      async infiniteLoad($state) {
        let data = await this.followRecordData()

        this.currentPage += 1;
        // 通知分页组件加载完成
        $state.loaded()

        // 没有更多数据时通知加载组件
        if (!data) {
          $state.complete()
        } else {
          if (data.length < this.pageSize) {
            $state.complete()
          }
        }
      },
      async followRecordData() {
        let that = this;
        let params = {
          pageSize: 10,
          currentPage: this.currentPage,
          moduleType: this.queryParms.moduleType,
          activityType: this.queryParms.activityType,
          moduleId: this.queryParms.moduleId,
          moduleName: this.queryParms.moduleName,
        }
        let data

        this.isLoading = true;
        data = await this.$ajax.get('/api/activity/queryActivityListByPage', {params: params});
        this.replyParms.parentData = this.replyParms.parentData.concat(data.data);
        this.activitys = this.replyParms.parentData;
        return data.data;
      },

      goComments(id, replyId, replyName) {
        if (replyId == this.currId) return;
        this.replyParms.moduleId = id;
        this.replyParms.isRely++;
        $('.comments-animation').hide();
        this.replyParms.replyId = replyId || '';
        this.replyParms.replyName = replyName || '';
        //this.$store.state.sendBox.isRely=this.replyParms.isRely;
        //console.log(this.$store.state.sendBox.isRely)
      },
      goCamera() {
        let that = this;

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
            alert(JSON.stringify(error));
          }
        })
      },
      postTxt() {
        let that = this;

        if (!this.postTxtFlag) return;
        this.postTxtFlag = false;
        //记录提交接口+'&'
        this.$ajax.post('/api/activity/addActivity?moduleId=' + this.queryParms.moduleId + '&activityContent=' + this.message + '&moduleType=' + this.queryParms.moduleType + '&moduleName=' + this.queryParms.moduleName + '&activityType=7&filePath=' + this.imgPath
        ).then(results => {

          this.message = '';
          this.imgPath = '';
          this.replyParms.parentData = [];
          this.activitys = this.replyParms.parentData;
          this.currentPage = 0;
          this.followRecordData();
          this.postTxtFlagt = true;
          //若是线索，则更新线索状态为跟进中
          if (that.queryParms.moduleType == 'clue') {
            that.$ajax.get("/api/clue/updateClueInfoToFollowing?id=" + that.queryParms.moduleId);
          }
          window.location.reload();
        });

      },
      showReplyMore(i) {

        if (!this.replyParms.parentData[i].showReplyIco) {
          this.replyParms.parentData[i].showReplyIco = true;
          this.replyParms.parentData[i].showReplyText = '收起';
        } else {
          this.replyParms.parentData[i].showReplyIco = false;
          this.replyParms.parentData[i].showReplyText = '查看全部动态收起';
        }
        // console.log(this.replyParms.parentData[i].showReplyIco)
        this.$set(this.activitys, i, this.replyParms.parentData[i]);
      },
      getCurrentUserDetailInfo() {
        this.$ajax.get("/api/userCenter/getCurrentUserDetailInfo").then(results => {
          this.currId = results.data.id;
        });
      },
      fabulous(item, i) {
        if (!this.fabulousFlag) return;
        this.fabulousFlag = false;
        //点赞
        let params = {
          moduleType: this.replyParms.moduleType,
          type: 2,
          moduleId: item.id
        };

        let commentId = '';
        let classes = false;
        let classes_index = 0;
        if (item.comments) {
          for (let j = 0; j < item.comments.approvalList.length; j++) {
            if (item.comments.approvalList[j].createdId == this.currId) {
              classes = true;
              params.commentId = item.comments.approvalList[j].id;
              classes_index = j;
              break;
            }
          }
        }

        if (classes) {
          this.$ajax.get("/api/comment/deleteComment", {params: params}).then(results => {
            this.replyParms.parentData[i].comments.approvalList[classes_index] = '';
            this.replyParms.parentData[i].comments.approvalTimes--;
            this.fabulousFlag = true;
            // this.$set(this.activitys,i,this.replyParms.parentData[i]);
          });
        } else {
          this.$ajax.post("/api/comment/saveComment", params).then(results => {
            if (!this.replyParms.parentData[i].comments) {
              this.replyParms.parentData[i].comments = {
                commentList: [],
                approvalTimes: 0,
                approvalList: [],
                commentTimes: 0,
              }
            }
            this.replyParms.parentData[i].comments.approvalList = this.replyParms.parentData[i].comments.approvalList.concat(results.data);
            this.replyParms.parentData[i].comments.approvalTimes++;
            this.fabulousFlag = true;
            //this.$set(this.activitys,i,this.replyParms.parentData[i]);
            // console.log(this.replyParms.parentData[i].comments)
          });
        }
      },
      //签到
      goSign() {
        // this.$router.push('/sign?type=1&moduleId='+this.queryParms.moduleId+'&moduleType='+this.queryParms.moduleType+'&moduleName='+this.queryParms.moduleName);
      },
      //显示大图
      showBig(item) {
        if (item) {
          this.$store.commit('setBigImage', {
            show: true,
            src: item
          });
        }
        //	console.log(this.$store.state.bigImage)
      },
      //编辑跟进记录
      goEdit(data) {
        let msg = '当前记录编辑已超' + this.timeSet + '分钟,不可编辑！';
        if (!this.isUpdateFuc(data.createTime, data.activityType)) {
          alert(1);
          dd.device.notification.toast({
            'global': true,
            'icon': 'error',
            'text': msg,
            'duration': 2,
            'delay': 0
          })
          return;
        }
        this.$storage.setItem('editFollowRecord', JSON.stringify(data));
        this.$router.push('/public/editFlollwRecord');
      }

    },

    beforeDestroy() {
      this.$store.commit('setSendBox', {
        isRely: 1,
        showFollow: 0,
      });

      //   $('.comments-animation').hide();
    },
    destoryed() {

    }

  }
</script>
<style lang="less" scoped="">
  @import url('./style.less');
</style>
<style lang="css">
  .comment-popup-top {
    width: 100%;
    text-align: center;
    color: #fff;
    padding: 1rem 0;
    background: rgba(0, 0, 0, .5)
  }

  .ac {
    font-size: 1.6rem;
  }
</style>
