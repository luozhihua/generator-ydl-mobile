import Vue from 'vue'
import Vue2Filters from 'vue2-filters'
import FastClick from 'fastclick'
import qs from 'qs'
import App from './App.vue'
import store from './store/'
import router from 'router'
import MuseUI from 'muse-ui'
import mixin from './mixin/index'
import './components'
import './directives'
import ddConfig from 'utils/dd-config'
import Backbutton from 'utils/backbutton'
import {Ajax} from 'shark-components'

import 'muse-ui/dist/muse-ui.css'
import './styles/index.less'

const query = qs.parse(document.location.search.replace(/^\?/, ''))

Vue.use(MuseUI) // Usage: http://www.muse-ui.org/#/install
Vue.use(Vue2Filters) // Usage: https://github.com/freearhey/vue2-filters#toc5
Ajax.install(Vue)

if (query.company) {
  store.commit('companyId', query.company)
  store.commit('appId', query.app)

  // 公司 ID 变化后需要重新登录（清除用户信息后，路由控制器会自动跳到登录界面）
  store.commit('user', null)
}

if (!Vue.fastclickInited) {
  FastClick.attach(document.body)
  Vue.fastclickInited = true
}

ddConfig.sign()
  .then(()=> {
    document.addEventListener('backbutton', Backbutton.handler)
  })

mixin()

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
