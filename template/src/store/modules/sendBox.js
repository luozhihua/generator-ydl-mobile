// initial state
const state = {
  isRely: 1,
  showFollow: 0,
  moduleId: '',
  moduleType: '',
  moduleName: '',
  callback: ''
}

// getters
const getters = {}

// actions
const actions = {}

// mutations
const mutations = {
  setSendBox(state, data) {
    Object.assign(state, data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
