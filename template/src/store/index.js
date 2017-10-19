import Vue from 'vue'
import Vuex from 'vuex'
import createPersist from 'vuex-localstorage'
import packageJson from '../../package.json'

import frame from './modules/frame'
import auth from './modules/auth'
import page from './modules/page'
import toast from './modules/toast'
import sendBox from './modules/sendBox'
import bigImage from './modules/bigImage'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const store = new Vuex.Store({
  modules: {
    frame,
    auth,
    page,
    toast,
    sendBox,
    bigImage
  },

  strict: debug,

  // 使用 vuex-localStorage 持久化页面状态
  plugins: [createPersist({
    namespace: `${packageJson.name}@${packageJson.version}:vuex`,
    expires: 7 * 24 * 60 * 60 * 1000
  })]
})

export default store
