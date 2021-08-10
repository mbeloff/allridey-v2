import {
  createStore
} from 'vuex'
import createPersistedState from "vuex-persistedstate";

export default createStore({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    phone: '1800 24 68 69',
    phoneuri: '1800246869',
    step1: {},
    step2: {},
    step3: {},
    searchParams: {},
    bookingparams: {},
    bookinginfo: {
      bookinginfo: [{}],
      companyinfo: [{}],
      customerinfo: [{}],
      extrafees: [],
      paymentinfo: [],
      rateinfo: []
    },
    resinfo: {
      reservationref: "",
      reservationno: "",
      customerid: ""
    },
    gotBooking: false,
    hasSession: false,
  },
  mutations: {
    session(state, payload) {
      state.hasSession = payload
    },
    searchParams(state, payload) {
      state.searchParams = payload
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
    bookingparams(state, payload) {
      state.bookingparams = payload
    },
    bookinginfo(state, payload) {
      state.bookinginfo = payload
    },
    resinfo(state, payload) {
      state.resinfo = payload
    },
    gotBooking(state, payload) {
      state.gotBooking = payload
    },
  },
  actions: {
    session(context, payload) {
      context.commit('session', payload)
    },
    searchParams(context, payload) {
      context.commit('searchParams', payload)
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
    bookingparams(context, payload) {
      context.commit('bookingparams', payload)
    },
    bookinginfo(context, payload) {
      context.commit('bookinginfo', payload)
    },
    resinfo(context, payload) {
      context.commit('resinfo', payload)
    },
    gotBooking(context, payload) {
      context.commit('gotBooking', payload)
    },
  },
})

