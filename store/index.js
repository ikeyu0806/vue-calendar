export const state = () => ({
  login: false,
  userId: 0
})

export const getters = {
  isLogin (state) {
    return state.login
  },
  userId (state) {
    return state.userId
  }
}

export const mutations = {
  setLogin (state, payload) {
    state.login = payload.login
  },
  setUserId (state, payload) {
    state.userId = payload.userId
  }
}
