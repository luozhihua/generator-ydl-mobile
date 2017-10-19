import Layout from 'components/frame/index.vue'

const load = (view) => () => import(`./views/${ view }`)

export default [
  {path: '/auth/login', component: load('auth/login/index')},
  {path: '/auth/login/mobile', component: load('auth/login/mobile')},
  {path: '/errors/404', component: load('errors/404')},
  {path: '/errors/401', component: load('errors/401')},
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: '首页',
    icon: 'icon-home',
    noDropdown: true,
    children: [{path: 'index', name: '首页', component: load('home/index')}]
  }
]
