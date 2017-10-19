<style lang="less" scoped>
  .login-ding {
    display: flex;
    height: 100vh;
    width: 100vw;
    justify-items: center;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    background-color: @color-primary;

    .login-box {
      margin: auto;
      text-align: center;
    }

    .logo {
      display: inline-block;
      margin: 0;
      padding: 0;
      width: 20vw;
      height: 20vw;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 .4rem .4rem rgba(0, 0, 0, 0.1);
      background-image: url(../../../assets/images/logo-128.png);
      background-size: cover;

      &+p {
        font-weight: lighter;
        color: #fff;
        margin-top: 2rem;
        font-size: 1.5rem;
      }
    }

  }
</style>

<template>
  <div class="login-ding">
    <div class="login-box">
      <figure class="logo"></figure>
      <p>
        正在验证您的权限...
      </p>
    </div>
  </div>
</template>

<script>
  import ddConfig from 'utils/dd-config'

  export default {
    data() {
      return {
        companyId: this.$store.getters.companyId,
        appId: this.$store.getters.appId
      }
    },

    mounted() {
      this.login()
    },

    methods: {

      isLogin() {
        return this.$store.getters.user
      },

      /**
       * 登录
       * @return {[type]} [description]
       */
      login() {
        let from = decodeURIComponent(this.$route.query.from || '/')

        // 钉钉签名
        ddConfig.sign()

        // 获取用户信息
          .then(() => {
            return new Promise((res, rej) => {
              dd.biz.user.get({
                onSuccess: function (userInfo) {
                  res(userInfo);
                },
                onFail: function (err) {
                  // res({emplId:'18621311373',corpId:'dinga568ce1ec34c38f1'})
                  rej(err);
                }
              });
            });
          })

          // 登录
          .then((userInfo) => {
            let loginUrl = '/api/userCenter/telephoneLogin'
            let loginParams = {
              data: {
                ddId: userInfo.emplId,
                corpId: userInfo.corpId
              }
            };

            this.$ajax.post(loginUrl, loginParams).then((response) => {
              if (response.status.toString() === '200') {
                this.$store.commit('user', {
                  companyId: this.companyId,
                  appId: this.appId,
                  ddId: loginParams.data.ddId
                })

                this.$router.push(from)
              } else {
                this.error = response.msg || response.message
                console.error(response)
              }
            }).catch((err) => {
              this.error = '网络或服务器错误'
              console.error(err)
            })
          })
          .catch((err)=>{
            console.log(err)
          })
      }
    }
  }
</script>
