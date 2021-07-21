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
    submittedParams: {},
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
    bookingparams(state, payload) {
      state.bookingparams = payload
    },
    bookinginfo(state, payload) {
      state.bookinginfo = payload
    },
    resinfo(state, payload) {
      state.resinfo = payload
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
    bookingparams(context, payload) {
      context.commit('bookingparams', payload)
    },
    bookinginfo(context, payload) {
      context.commit('bookinginfo', payload)
    },
    resinfo(context, payload) {
      context.commit('resinfo', payload)
    },
  },
})

// {
//   "bookinginfo": [{
//     "reservationref": "",
//     "reservationno": "",
//     "reservationdocumentno": "",
//     "reservationstatus": "",
//     "reservationtypedescription": "",
//     "reservationcreateddate": "",
//     "isvehicleallocated": Boolean,
//     "isquotation": Boolean,
//     "quoteconversionurl": "",
//     "agreementpage": "",
//     "quoteconversionvalidmessage": "",
//     "driverageid": Number,
//     "pickuplocationid": Number,
//     "pickupdate": "",
//     "pickuptime": "",
//     "pickuplocationname": "",
//     "pickuplocationaddress": "",
//     "arrivalpoint": "",
//     "flightin": "",
//     "dropofflocationid": Number,
//     "dropoffdate": "",
//     "dropofftime": "",
//     "dropofflocationname": "",
//     "dropofflocationaddress": "",
//     "departurepoint": "",
//     "flightout": "",
//     "rentalsource": "Online Booking",
//     "customerid": "580",
//     "customerremark": "",
//     "numbertravelling": "0",
//     "areaofusedescription": "",
//     "transmission": "",
//     "urlpathfordocuments": "https://rentalcarmanagerau.blob.core.windows.net/public/auallridey534/",
//     "vehiclecategoryid": 3,
//     "vehiclecategory": "Allridey car",
//     "vehicleimage": "allridey-i20.jpg",
//     "vehicledescription1": "",
//     "vehicledescription2": "",
//     "vehicle_numberofadults": 5,
//     "vehicle_numberofchildren": 0,
//     "vehicle_numberoflargecases": 0,
//     "vehicle_numberofsmallcases": 0,
//     "sippcode": "",
//     "currencyname": "AUD",
//     "currencysymbol": "$",
//     "shouldhiderates": false,
//     "shouldhideextrarates": false,
//     "shouldhideinsurancerates": false,
//     "numberofdays": 1,
//     "dailyrate": 1,
//     "totalcost": 0,
//     "campaigncode": "",
//     "payment": 0,
//     "balancedue": 0,
//     "taxname1": "GST",
//     "taxname2": "",
//     "stampduty": 0,
//     "gst": 0,
//     "isgstinclusive": true,
//     "mileagedesc": "Kms",
//     "kmcharges_id": 0,
//     "kmcharges_description": "",
//     "kmcharges_feeforeachadditionalkm": 0,
//     "kmcharges_additionalkmtotalamount": 0,
//     "kmcharges_dailyrate": 0,
//     "kmcharges_maximumprice": 0,
//     "kmcharges_totalfordailyrate": 0,
//     "kmcharges_totalnumberofkmsfree": 0,
//     "kmcharges_notes": null,
//     "agentrefno": "",
//     "agent": null,
//     "agentbranch": null,
//     "agentcommission": 0,
//     "agentnetamountdue": 0,
//     "agentemail": null
//   }],
//   "customerinfo": [{
//     "customerid": 580,
//     "firstname": "TEST",
//     "lastname": "TEST",
//     "dateofbirth": "01/Jan/1900",
//     "licenseno": "",
//     "licenseissued": "",
//     "licenseexpires": "",
//     "email": "",
//     "phone": "",
//     "mobile": "",
//     "fulladdress": "",
//     "address": "",
//     "city": "",
//     "state": "",
//     "postcode": "",
//     "country": "Australia",
//     "countryid": 7,
//     "localaddress": "",
//     "passport": "",
//     "loyaltycardno": ""
//   }],
//   "companyinfo": [{
//     "logo": "allridey-logo-sm.png",
//     "companyemail": "allridey@campervanvillage.com",
//     "companyname": "Juicy Love Trust ATF Juicy Love Pty Ltd T/as Wicked Campers",
//     "companycolour": "#0080c0",
//     "branchaddress": "100 Longlands St",
//     "branchcity": "Woolloongabba",
//     "branchpostcode": "QLD 4102 Australia",
//     "branchphone": "",
//     "branchfax": "",
//     "website": "www.allridey.com.au",
//     "freephone": ""
//   }],
//   "rateinfo": [{
//     "season": "Rate",
//     "numberofdays": 1,
//     "numberofhours": 0,
//     "dailyratebeforediscount": 1,
//     "dailyrateafterdiscount": 1,
//     "discountname": "",
//     "discountdescription": "",
//     "discountpercentagerate": 0,
//     "discountdailyrate": 0,
//     "monthlyrate_numberofmonths": 0,
//     "monthlyrate_afterdiscount": 0,
//     "monthlyrate_numberofextradays": 0,
//     "monthlyrate_extradaysrateafterdiscount": 1,
//     "ratesubtotal": 1
//   }],
//   "extrafees": [],
//   "paymentinfo": [],
//   "extradrivers": []
// }