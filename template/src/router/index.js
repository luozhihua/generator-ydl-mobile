import Vue from 'vue'
import VueRouter from 'vue-router'
import ROUTES from '../routes'
import patterns from './patterns'
import store from '../store/index'
import vueg from 'vueg'
import 'vueg/css/transition-min.css'

Vue.use(VueRouter)

const load = (view) => () => import(`../views/${ view }`)

let defaultRoute

ROUTES.forEach(route => {
  if (route.path === '/') {
    defaultRoute = route
  }
})

patterns.forEach(path => {
  let exsits

  defaultRoute.children.forEach(route => {
    if (route.path === path) {
      exsits = true
    }
  })

  if (!exsits) {
    defaultRoute.children.push({
      path: path,
      component: load(path)
    })
  }
})

ROUTES.push({
  path: '*',
  hidden: true,
  component: load('errors/404')
})

const router = new VueRouter({
  mode: 'history',
  routes: ROUTES
})

router.beforeEach(function (to, from, next) {
  let isDing = navigator.userAgent.match(/DingTalk/)
  let requiredAuth = !to.path.match(/\/(auth|errors)/)
  let authed = store.getters.user

  if (requiredAuth && !authed && isDing) {
    store.commit('login')
  } else {
    next()
  }
})

router.afterEach((to, from, next) => {
})

Vue.use(vueg, router, {
  duration: '.25', // 转场动画时长，默认为0.3，单位秒
  firstEntryDisable: false, // 值为true时禁用首次进入应用时的渐现动画，默认为false
  firstEntryDuration: '.3', // 首次进入应用时的渐现动画时长，默认为.6
  forwardAnim: 'fadeInRight', // 前进动画，默认为fadeInRight
  backAnim: 'fadeInLeft', // 后退动画，默认为fedeInLeft
  sameDepthDisable: false, // url深度相同时禁用动画，默认为false
  tabs: [{
    name: 'home'
  }, {
    name: 'my'
  }], // 默认为[]，'name'对应路由的name,以实现类似app中点击tab页面水平转场效果，如tabs[1]到tabs[0]，会使用backAnim动画，tabs[1]到tabs[2]，会使用forwardAnim动画
  tabsDisable: true, // 值为true时，tabs间的转场没有动画，默认为false
  shadow: false, // 值为false，转场时没有阴影的层次效果
  disable: false // 禁用转场动画，默认为false，嵌套路由默认为true
})

document.body.addEventListener('click', function (event) {
  let link = event.target || event.srcEvent
  let path

  while (link.tagName !== 'BODY') {
    if (link.tagName === 'A') {
      path = link.getAttribute('href')
      break;
    }

    link = link.parentNode
  }

  if (path && !path.match(/^[\w\d\_\-]+:/)) {
    event.preventDefault()

    router.push(path)
  }
})

export default router
