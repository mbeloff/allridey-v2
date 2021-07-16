<template>
  <div class="bg-gray-100 h-full bg-center bg-cover" :class="{ 'full-bg' : this.status < 3}">
    <div class="w-full flex px-4 py-1 bg-red-500 gap-4 text-sm">
      <span class="text-white">dev panel:</span>
      <button class="text-red rounded border bg-white px-2" @click="getBookingInfo(testreservationinfo.reservationref), status = 5">gotosummary</button>
      <button class="text-red rounded border bg-white px-2" @click="gotoPayment(testreservationinfo), status = 4">gotopayment</button>
    </div>
    
    <div class="max-w-screen-lg mx-auto flex flex-col gap-5 py-10">
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

    <form-payment v-if="status == 4" :reservation="reservationinfo"></form-payment>
    <submit-payment v-if="status == 4.5" @pay-finished="showSummary"></submit-payment>
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
        step1: {},
        status: 1,
        submittedParams: {},
        searchResults: {},
        count: 0,
        vehicle: {},
        loading: false,
        // ! test res info
        reservationinfo: {},
        testreservationinfo: {
          reservationref: "580F27D5F1C0", 
          reservationno: 945, 
          customerid: 580
        },
        bookinginfo: {}
      }
    },
    mounted() {
      // navigate to step 4.5 after payment redirect
      if (this.$route.query.payment == 1) {
        this.status = 4.5
      }

      
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
        this.reservationinfo = e
        
      },
      showSummary(e) {
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
.full-bg {
  background-image:url('https://res.cloudinary.com/dg5ybbkbh/image/upload/w_1080,q_auto,f_auto/v1625712411/allridey/acxidh.jpg')
}
</style>