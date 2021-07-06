<template>
  <div class="bg-gray-100 h-full">
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

    <selected-vehicle @submit-booking="getVault" @submit-quote="showSummary" v-if="status == 3 && step3" :step3="step3" :submittedParams="submittedParams"></selected-vehicle>

    <form-payment v-if="status == 4" :reservation="reservationinfo" @payment-saved="showSummary"></form-payment>

    <summary-page v-if="status == 5 && bookinginfo" :bookinginfo="bookinginfo"></summary-page>
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
  export default {
    components: {
      BookingForm,
      BookingNav,
      SearchResults,
      SelectedVehicle,
      Spinner,
      FormPayment,
      SummaryPage
    },
    data() {
      return {
        status: 1,
        submittedParams: {},
        searchResults: {},
        count: 0,
        vehicle: {},
        loading: false,
        reservationinfo: {},
        bookinginfo: {}
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
      getVault(e) {
        this.status = 4
        console.log(e)
        this.reservationinfo = e
      },
      showSummary(e) {
        this.status = 5
        console.log(e)
        this.getBookingInfo(e.reservationref)
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