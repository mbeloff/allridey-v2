<template>
  <div class="bg-gray-100 h-full bg-center bg-cover" style="background-image: url('https://res.cloudinary.com/dg5ybbkbh/image/upload/w_1080,q_auto,f_auto/v1625712411/allridey/acxidh.jpg')">
    <div class="w-full flex px-4 py-1 bg-red-500 gap-4">
      <span class="text-white">dev panel:</span>
      <button class="text-red rounded border bg-white" @click="getBookingInfo('57980BEBAA44'), status = 5">gotosummary</button>
      <button class="text-red rounded border bg-white" @click="gotoPayment(testreservationinfo), status = 4">gotopayment</button>
    </div>
    
    <div class="main-content max-w-screen-lg h-full mx-auto flex flex-col gap-5 py-10">
      <booking-nav @changeStep="changeStep" :status="status"></booking-nav>

    <keep-alive>
      <booking-form v-if="status < 3" @update-status="updateStatus" @searching="searching" @update-search-results="updateSearchResults"></booking-form>
    </keep-alive>

<div v-if="this.loading"  class="bg-white rounded bg-opacity-90 shadow-xl w-full py-5 flex place-items-center justify-center">
  <spinner></spinner>
  <p>loading...</p>
  </div>
    

    <search-results @select-vehicle="selectVehicle" v-if="status == 2 && this.searchResults && !this.loading" :results="this.searchResults" :key="this.count" :submittedParams="this.submittedParams"></search-results>

    <selected-vehicle @submit-booking="gotoPayment" @submit-quote="showSummary" v-if="status == 3 && step3" :step3="step3" :submittedParams="submittedParams"></selected-vehicle>

    <form-payment v-if="status == 4" :reservation="reservationinfo" @payment-saved="showSummary"></form-payment>
    <submit-payment v-if="status == 4.5" @pay-finished="showSum"></submit-payment>
    <summary-page v-if="status == 5 && bookinginfo.bookinginfo" :bookinginfo="bookinginfo"></summary-page>
    </div>
    

  </div>

</template>
<script>
  import Mixins from '../Mixins'
  import BookingForm from '../components/FormSearch.vue'
  import BookingNav from '../components/BookingNav.vue'
  import SearchResults from '../components/SearchResults.vue'
  import SelectedVehicle from '../components/SelectedVehicle.vue'
  import Spinner from '../components/Spinner.vue'
  import FormPayment from '../components/FormPayment.vue'
  import SummaryPage from '../components/Summary.vue'
  import SubmitPayment from '../components/SubmitPayment.vue'
  export default {
    components: {
      BookingForm,
      BookingNav,
      SearchResults,
      SelectedVehicle,
      Spinner,
      FormPayment,
      SummaryPage,
      SubmitPayment
    },
    props: {
      payment: {}
    },
    data() {
      return {
        status: 1,
        submittedParams: {},
        searchResults: {},
        count: 0,
        vehicle: {},
        loading: false,
        // ! test res info
        reservationinfo: {},
        testreservationinfo: {
          reservationref: "57980BEBAA44", 
          reservationno: 941, 
          customerid: 569
        },
        bookinginfo: {}
      }
    },
    mounted() {
      if (this.$route.query.payment == 1) {
        this.status = 4.5
      }
      // if (this.$route.query.res && this.$route.query.step) {
      //   this.getBookingInfo(this.$route.query.res)
      //   this.reservationinfo = {
      //     reservationref: this.bookinginfo.bookinginfo[0].reservationref,
      //     reservationno: this.bookinginfo.bookinginfo[0].reservationno,
      //     customerid: this.bookinginfo.customerinfo[0].customerid
      //   }
      //   this.status = this.$route.query.step
      // }
    },
    methods: {
      searching(e) {
        this.loading = e
      },
      changeStep(e) {
        this.updateStatus(e)
        if (e == 1) {
          this.submittedParams = {},
            this.searchResults = {}
        }
      },
      updateStatus(e) {
        this.status = e;
      },
      updateSearchResults(e, f) {
        this.searchResults = e
        this.submittedParams = f
        this.count++
        this.$forceUpdate()
      },
      selectVehicle(data, step) {
        this.updateStatus(step)
        this.step3 = data
      },
      gotoPayment(e) {
        this.status = 4
        // console.log(e)
        this.reservationinfo = e
      },
      // ! after vault entry e = resref
      showSummary(e) {
        this.status = 5
        this.getBookingInfo(JSON.parse(e).reservationref)
        this.$forceUpdate()
      },
      showSum(e) {
        this.status = 5
        this.getBookingInfo(e)
        this.$forceUpdate()
      },
      getBookingInfo(ref) {
        let params = JSON.stringify({
          "method":"bookinginfo",
          "reservationref":ref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.bookinginfo = res
        })
      },
    }
  }
</script>

<style>

</style>