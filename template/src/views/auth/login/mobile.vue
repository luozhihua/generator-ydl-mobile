<style lang="less">
  .login-mobile {
    display: flex;
    align-items: center;
    justify-items: center;
    height: 100vh;
    width: 100vw;

    .login-box {
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
      border-radius: 1rem;
      padding: 2rem;
      margin: auto;
    }
  }
</style>

<template>
  <div class="login-mobile">
    <div class="login-box">
      <mu-text-field hintText="手机号码" v-model="form.account" type="number"/><br/>
      <mu-text-field hintText="密码" v-model="form.password" type="password" :rows="3" :rowsMax="6"/><br/>
      <mu-raised-button label="登录" class="demo-raised-button" primary fullWidth @click="login"/>

      <mu-dialog :open="dialog" @close="dialog=false" title="请选择公司" scrollable>
        <mu-menu>
          <mu-menu-item
            v-for="company, index in companyList"
            :key="index"
            :title="company.name"
            @click="chooseCompany(company)"/>
        </mu-menu>
      </mu-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          account: '',
          password: ''
        },
        companyList: [],
        baseUserId: '',
        companyId: this.$store.getters.companyId,
        appId: this.$store.getters.appId,
        dialog: false
      }
    },

    mounted() {
    },

    methods: {

      isLogin() {
        return this.$store.getters.user
      },

      /**
       * 登录
       * @return {[type]} [description]
       */
      async login() {
        if (this.form.password.trim() !== '') {
          Promise.all([
            import('./rsa'),
            this.$ajax.get('/api/userCenter/keyPair')
          ]).then(([RSA, keyPair]) => {
            let publicKey = RSA.getKeyPair(keyPair.exponent, '', keyPair.ownModulus)
            let password = RSA.encryptedString(publicKey, this.form.password)
            let isEmail = this.form.account.indexOf('@') !== -1
            let loginData = {
              data: {
                loginFlag: isEmail ? '1' : '0',
                password: password
              }
            }

            if (isEmail) {
              loginData.data.registerEmail = this.form.account
            } else {
              loginData.data.telephone = this.form.account
            }

            this.$ajax.post('/api/userCenter/login', JSON.stringify(loginData))
              .then((response) => {
                this.baseUserId = response.data.baseUserId
                this.dialog = true
                this.loadAvailabeCompany()
              })
          })
        }
      },

      /**
       * 加载当前用户所关联的公司列表
       * @return {Promise.<void>}
       */
      async loadAvailabeCompany() {
        let response

        try {
          response = await this.$ajax.get(`/api/userCenter/getCompanys?baseUserId=${this.baseUserId}`)

          this.companyList = response.data
        } catch (err) {
          console.error(err)
        }
      },

      /**
       * 选择公司
       * @param company
       */
      async chooseCompany(company) {
        let from = decodeURIComponent(this.$route.query.from || '/')
        let companyId = company.id
        let companyUrl = `/api/userCenter/choiceCompany?companyId=${companyId}`

        // 用户详情接口暂时无权限访问
        // let userId = this.baseUserId
        // let userUrl = `/api/userCenter/getUserDetailInfo?id=${userId}`
        // let userRes

        try {
          await this.$ajax.get(companyUrl)

          // userRes = await this.$ajax.get(userUrl)
          // debugger

          this.$router.push(from)
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>
