let navShowTicket

// initial state
const state = {
  visibled: false,
  activeNav: 'crm',
  navVisible: false,
  navLocked: false,
  loading: false
}

// getters
const getters = {
  visibled: state => state.visibled,
  activeNav: state => state.activeNav,
  navVisible: state => state.navVisible,
  navLocked: state => state.navLocked,
  loading: state => state.loading
}

// actions
const actions = {
  /**
   *
   * @param state
   * @param shorttime
   */
  showNav({state, commit}, shorttime = false) {
    if (!state.navLocked || shorttime) {
      commit('unlockNav')
      commit('showNav')
      commit('lockNav')
    }

    // 如果是临时显示，则5秒后自动隐藏
    clearTimeout(navShowTicket)
    if (shorttime) {
      navShowTicket = setTimeout(() => {
        commit('hideNav')
      }, 5000)
    }
  }
}

// mutations
const mutations = {
  hideApp(state) {
    state.visibled = false
  },

  showApp(state) {
    state.visibled = true
  },

  setActiveNav(state, activeNav) {
    state.activeNav = activeNav
  },

  hideNav(state) {
    state.navVisible = false
  },

  /**
   *
   * @param state
   * @param shorttime
   */
  showNav(state) {
    if (!state.navLocked) {
      clearTimeout(navShowTicket)
      state.navVisible = true
    }
  },

  toggleNav(state) {
    state.navVisible = !state.navVisible
  },

  hideLoading(state) {
    state.loading = false
  },

  /**
   *
   * @param state
   * @param shorttime
   */
  showLoading(state) {
    state.loading = true
  },

  toggleLoading(state) {
    state.loading = !state.loading
  },

  lockNav(state) {
    state.navLocked = true
  },

  unlockNav(state) {
    state.navLocked = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
