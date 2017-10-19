// initial state
const state = {
  queue: []
}

// getters
const getters = {
  list: state => state.queue
}

// actions
const actions = {}

// mutations
const mutations = {
  addToast (state, toast) {
    state.queue.push(toast)
  },

  removeToast (state, toast) {
    state.queue.push(toast)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
