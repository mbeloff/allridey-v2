import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    phone: '0417 740 307',
    phonenz: '0225 807 588',
    email: 'sales@allridey.com.au',
    checkinurl: 'https://checkin.allridey.com.au/',
    step1: {},
    step2: {},
    step3: {},
    locations: [],
    searchParams: {},
    bookinginfo: {
      bookinginfo: [{}],
      companyinfo: [{}],
      customerinfo: [{}],
      extrafees: [],
      paymentinfo: [],
      rateinfo: [],
    },
    resinfo: {
      reservationref: '',
      reservationno: '',
      customerid: '',
    },
    gotBooking: false,
    hasSession: false,
    storeCardOnly: false,
  },
  mutations: {
    vault(state, payload) {
      state.storeCardOnly = payload
    },
    locations(state, payload) {
      state.locations = payload
    },
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
    vault(context, payload) {
      context.commit('vault', payload)
    },
    session(context, payload) {
      context.commit('session', payload)
    },
    locations(context, payload) {
      context.commit('locations', payload)
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
