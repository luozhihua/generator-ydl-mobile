// initial state
const state = {
  footerStyle: {},
  mainStyle: {}
}

// getters
const getters = {
  footerStyle: state => state.footerStyle,
  mainStyle: state => state.mainStyle
}

// actions
const actions = {

}

// mutations
const mutations = {
  footerStyle (state, data) {
    state.footerStyle = data
  },
  mainStyle (state, data) {
    state.mainStyle = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
