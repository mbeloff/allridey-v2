import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    phone: '1800 24 68 69',
    phoneuri: '1800246869',
    step1: {},
    step2: {},
    step3: {},
    submittedParams: {}
  },
  mutations: {
    submittedParams(state, payload) {
      state.submittedParams = payload
    },
    step1(state, payload) {
      state.step1 = payload
    },
    step2(state, payload) {
      state.step2 = payload
    },
    step3(state, payload) {
      state.step3 = payload
    },
  },
  actions: {
    submittedParams(context, payload) {
      context.commit('submittedParams', payload)
    },
    step1(context, payload) {
      context.commit('step1', payload)
    },
    step2(context, payload) {
      context.commit('step2', payload)
    },    
    step3(context, payload) {
      context.commit('step3', payload)
    },    
  },
})