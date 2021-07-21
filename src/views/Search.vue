<template>
  <div class="bg-gray-100 h-full bg-center bg-cover" :class="{ 'full-bg' : this.status < 3}">
    <div class="w-full flex px-4 py-1 bg-red-500 gap-4 text-sm">
      <span class="text-white">dev panel:</span>
      <button class="text-red rounded border bg-white px-2" @click="getBookingInfo(testresinfo.reservationref), status = 5">gotosummary</button>
      <button class="text-red rounded border bg-white px-2" @click="$store.dispatch('resinfo', testresinfo), gotBooking = true, status = 4">gotopayment</button>
    </div>
    
    <div class="max-w-screen-lg mx-auto flex flex-col gap-5 py-10">
      <booking-nav @changeStep="changeStep" :status="status"></booking-nav>
    <keep-alive>
      <booking-form v-if="status < 3" @errs="showErrs" @update-step2="status = 2"></booking-form>
    </keep-alive>

    <div v-if="loading" class="bg-white rounded shadow-xl w-full py-5 flex place-items-center justify-center h-48 relative">
      <loading-overlay></loading-overlay>
    </div>
    
    <search-results @select-vehicle="status = 3" v-if="status == 2 && !loading && !isEmpty(this.$store.state.step2)"  :key="this.count" ></search-results>   

    <div v-if="errs.length" class="max-w-screen-lg mx-auto bg-white shadow-xl w-full rounded flex flex-col py-10">
      <p>No results found, please adjust your search</p>
      <p class="text-sm text-red-500" v-for="err in errs">{{err}}</p>
    </div>

    <!-- ! commented out submit function -->
    <!-- <selected-vehicle @submit="submit" v-if="status == 3 && step3"></selected-vehicle> -->
    <selected-vehicle @bookingMade="submit" v-if="status == 3 && step3"></selected-vehicle>

    <form-payment v-if="status == 4 && gotBooking" :reservation="resinfo"></form-payment>
    <submit-payment v-if="status == 4.5" @finishedpayment="status = 5, gotBooking = true"></submit-payment>
    <summary-page v-if="status == 5 && this.$store.state.gotBooking"></summary-page>
    
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
  import LoadingOverlay from '../components/LoadingOverlay.vue'
  export default {
    components: {
      BookingForm,
      BookingNav,
      SearchResults,
      SelectedVehicle,
      Spinner,
      FormPayment,
      SummaryPage,
      SubmitPayment,
      LoadingOverlay
    },
    props: {
      payment: {},
    },
    data() {
      return {
        status: 1,
        errs: [],
        count: 0,
        vehicle: {},
        loading: false,
        // ! test res info
        testresinfo: {
          reservationref: "580F27D5F1C0", 
          reservationno: 945, 
          customerid: 580
        },
        gotBooking: false
      }
    },
    watch: { 
      'status': {
      handler: function(status) {
        if(status == 5) {
          this.$router.push({name: 'Summary'})
        }
        if(status == 4) {
          this.$router.push({name: 'Payment'})
        }
      }
      },      
     '$route.name': {
        handler: function(name) {
           if  (name == 'Home' || name == 'Search') {
             this.status = 1
           } else if (name == 'Results') {
             if (this.isEmpty(this.step2)) {
               this.$router.push({name: 'Search'}) 
             } else {
               this.status = 2
             }             
           } else if (name == 'Vehicle') {
              if (this.isEmpty(this.submittedParams)) {
               this.$router.push({name: 'Search'})
             } else {
              this.status = 3
             }
           } else if (name == 'Payment') {
            //  if (!this.bookinginfo.bookinginfo) {
            //    this.$router.push({name: 'Vehicle'})
            //  }
             this.status = 4
           } else if (name == 'Summary') {
               this.status = 5                         
           }
        },
        deep: true,
        immediate: true
      }
    },
    mounted() {
      // navigate to step 4.5 after payment redirect
      if (this.$route.query.payment == 1) {
        this.status = 4.5
      }
    },
    computed: {
      step2() {
        return this.$store.state.step2
      },
      step3() {
        return this.$store.state.step3
      },
      submittedParams() {
        return this.$store.state.submittedParams
      },
      bookingparams() {
        return this.$store.state.bookingparams
      },
      bookinginfo() {
        return this.$store.state.bookinginfo
      },
      resinfo() {
        return this.$store.state.resinfo
      }
    },
    methods: {
      isEmpty(obj) {
        if (Object.keys(obj).length === 0) {
          return true
        } else {
          return false
        }
      },
      showErrs(e) {
        this.errs = e
      },
      searching(e) {
        this.loading = e
      },
      changeStep(e) {
        this.updateStatus(e)
      },
      updateStatus(e) {
        this.status = e;
      },
      updateSearchResults(e, f) {
        this.count++
        this.$forceUpdate()        
      },
      submit(mode, ref) {
        console.log('submit from search... ref=' + ref + 'mode=' + mode)
        this.getBookingInfo(ref)
        if (mode == 1) {          
          this.status = 5          
          this.$router.push({name: 'Summary'})
          this.$forceUpdate()
        }
        if (mode == 2) {
          this.status = 4      
          this.$router.push({name: 'Payment'})  
        }
      },
      getBookingInfo(ref) {
        console.log('getBookingInfo ref = ' + ref)
        let params = JSON.stringify({
          "method":"bookinginfo",
          "reservationref":ref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.$store.dispatch('bookinginfo', res)
          this.$store.dispatch('gotBooking', true)
        })
      },      
    }
  }
</script>

<style>
.full-bg {
  /* background-image: linear-gradient(to bottom, rgba(255,255,255,.5), rgba(255,255,255,.1)),url('https://res.cloudinary.com/dg5ybbkbh/image/upload/w_1080,q_auto,f_auto/v1625712411/allridey/acxidh.jpg') */
}
</style>