const cookie = require('./cookie')
let storage = window.localStorage || window.sessionStorage

/*
 * 降级使用 cookie 兼容不支持 localStorage和 sessionStorage 的环境
 */
if (!storage) {
  storage = {
    prefix: 'LOCAL_STORE_',
    expires: 10 * 365 * 24 * 60 * 60 * 60 * 1000, // 10年

    setItem: (key, value) => {
      cookie.setCookie(this.prefix + key, value, this.expires)
    },

    getItem: (key) => {
      let undef

      cookie.getCookie(this.prefix + key) || undef
    },

    removeItem: key => {
      cookie.setCookie(this.prefix + key, null, -1)
    }
  }
}

export default storage
