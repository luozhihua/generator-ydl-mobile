import ddConfig from 'utils/dd-config'

export default {

  methods: {

    /**
     * 获取 DingDing 组织 ID
     * @return {*}
     */
    getCorpId() {
      return ddConfig.getCorpId()
    },

    /**
     * 获取 App ID
     * @return {*}
     */
    getAppId() {
      return ddConfig.getAppId()
    },

    setDingTitleBg(color = '') {
      let queries = []

      color = color.replace(/^\#/, '').toUpperCase()

      /* eslint camelcase:off */
      if (this.$route.query.dd_nav_bgcolor !== ('FF' + color)) {

        this.$route.query.dd_nav_bgcolor = color ? `FF${color}` : 'FF50BAA1'
        Object.keys(this.$route.query).forEach(key => {
          let value = this.$route.query[key]

          queries.push(`${key}=${value}`)
        })

        window.location = '?' + queries.join('&')
      }
    },

    setDingTitle(title) {
      try {
        document.title = title
        ddConfig.sign()
          .then(() => {
            dd.biz.navigation.setTitle({title})
          })
          .catch(e => {})
      } catch (e) {
      }
    },

    setDingLeft(options = {}) {
      return ddConfig.sign()
        .then(() => {
          dd.biz.navigation.setLeft({
            show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
            control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
            showIcon: true, // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
            text: '', // 控制显示文本，空字符串表示显示默认文本

            ... options
          })
        })
    },

    setDingRight(options = {}) {
      return ddConfig.sign()
        .then(() => {
          dd.biz.navigation.setRight({
            show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
            control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
            text: '', // 控制显示文本，空字符串表示显示默认文本

            ... options
          })
        })
    },

    setDingMenu(menus) {
      return ddConfig.sign()
        .then(() => {

          let actions = []
          let options

          menus.forEach(menu => {
            menu.id = menu.id.toString()
            actions[menu.id] = menu.onClick
          })

          options = {
            items: menus,
            backgroundColor: '#666666',
            textColor: '#FFFFFF',
            onSuccess: (data) => {
              actions[data.id]()
            },
            onFail() {}
          }

          dd.biz.navigation.setMenu(options);
        })
        .catch(e => {

        })
    },

    initDingMenus() {

      let menus = this.dingMenus || this.$parent.dingMenus

      if (menus) {
        this.setDingMenu(menus)
      } else {
        ddConfig.sign()
          .then(() => {
            dd.biz.navigation.setRight({
              show: false
            })
          })
      }
    }
  }
}
