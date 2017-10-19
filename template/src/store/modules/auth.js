import store from 'store'
import router from 'router'
import Ajax from 'utils/ajax'
// initial state
const state = {
  user: null,
  token: null,
  companyId: null,
  appId: null
}

// getters
const getters = {
  user: state => state.user,
  token: state => state.token,
  companyId: state => state.companyId,
  appId: state => state.appId
}

// actions
const actions = {

}

// mutations
const mutations = {
  user(state, data) {
    state.user = data
  },

  appId(state, data) {
    state.appId = data
  },

  companyId(state, data) {
    state.companyId = data
  },

  token(state, data) {
    state.token = data
  },

  login(state, data) {
    let loginUrl = '/auth/login'
    let path = document.location.pathname || '/'
    let params = document.location.search
    let hash = document.location.hash
    let from = encodeURIComponent(path + params + hash)

    if (!window.navigator.userAgent.match(/DingTalk/)) {
      loginUrl += '/mobile'
    }

    router.push(`${loginUrl}?from=${from}`)
  },

  async logout(state) {
    try {
      await Ajax.get('/api/login/logout')
    } catch (err) {
      console.error(err)
    }

    store.commit('user', null)
    router.push('/auth/login')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
