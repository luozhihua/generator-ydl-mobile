import store from 'store'
import {Ajax} from 'shark-components'
// import qs from 'qs'

Ajax.defaults.baseURL = '/'
Ajax.defaults.headers.post['Content-Type'] = 'application/json'

// Request
Ajax.interceptors.request.use(function (request) {
  return request
})

// Response
Ajax.interceptors.response.use(function (response) {

  // 禁用 AJAX 严格模式，否则不会 resolve response.result 不等于 ‘success’的请求
  // 若是服务器 API 规范，所有请求都正确返回 response.result字段可以删除此行
  response.config.strict = false

  return response
}, function (error) {
  let {response} = error

  if (response.status === 403) {
    // 无权限
    dd.device.notification.toast({
      icon: 'error',
      text: '您没有此权限.',
      duration: 5,
      delay: 0.3
    })
  } else if (response.status === 401) {
    if (!document.location.pathname.match(/\/auth/)) {
      store.commit('login')
    }
  }

  return Promise.reject(error)
})

export default Ajax
