export const state = () => ({
  login: false
})

export const getters = {
  isLogin (state) {
    return state.login
  }
}

export const mutations = {
  setLogin (state, payload) {
    state.login = payload.login
  }
}
