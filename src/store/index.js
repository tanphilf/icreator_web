import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showNav: false,
    user: {},
  },
  mutations: {
    updateNavState (state, status = false) {
      state.showNav = status
    },
    updateUser (state, user) {
      state.user = user;
    },
  },
  actions: {
    setNavState (context, status = false) {
      context.commit('updateNavState', status)
    },
    setUser (context, user) {
      context.commit('updateUser', user)
    },
  },
  modules: {
  }
})
