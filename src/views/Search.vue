<template>
  <div class="bg-gray-100 h-full bg-center bg-cover" :class="{ 'full-bg' : this.status < 3}">
    <!-- <div class="w-full flex px-4 py-1 bg-red-500 gap-4 text-sm opacity-20 hover:opacity-100">
      <span class="text-white">dev panel:</span>
      <button class="text-red rounded border bg-white px-2" @click="getBookingInfo(testresinfo.reservationref), status = 5, this.$router.push({name: 'Summary'})">summary</button>
      <button class="text-red rounded border bg-white px-2" @click="$store.dispatch('resinfo', testresinfo), $store.dispatch('gotBooking', true), status = 4, this.$router.push({name: 'Payment'})">payment</button>
    </div> -->
    <div class="bg-cover bg-center" style="background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/v1/allridey/1823.jpg)">
      <div class="max-w-screen-lg mx-auto flex flex-col gap-10 py-10 px-2">
        <booking-nav v-if="status > 2" @changeStep="changeStep" :status="status"></booking-nav>
        <keep-alive>
        <form-search v-if="status < 3" @errs="showErrs" @searching="setLoading" @update-step2="status = 2"></form-search>
        </keep-alive>
      </div>      
    </div>
    

    <div class="max-w-screen-lg mx-auto flex flex-col gap-5 py-10 px-2">
      <div v-if="loading" class="bg-white rounded shadow-xl w-full py-5 flex place-items-center justify-center h-48 relative">
        <loading-overlay></loading-overlay>
      </div>      
      <search-results @mounted="setLoading(false)" @select-vehicle="status = 3" v-if="status == 2 && !isEmpty(this.$store.state.step2)"  :key="this.count" ></search-results>   
      <div v-if="errs.length" class="max-w-screen-lg mx-auto bg-white shadow-xl w-full rounded flex flex-col py-10">
        <p>No results found, please adjust your search</p>
        <p class="text-sm text-red-500" v-for="err in errs">{{err}}</p>
      </div>
      <selected-vehicle @bookingMade="submit" v-if="status == 3 && step3"></selected-vehicle>
      <form-payment v-if="status == 4 && $store.state.gotBooking" :reservation="resinfo"></form-payment>
      <!-- <submit-payment v-if="status == 4.5" @finishedpayment="status = 5, $store.dispatch('gotBooking', true)"></submit-payment> -->
      <summary-page v-if="status == 5 && $store.state.gotBooking && $store.state.bookinginfo.bookinginfo.length > 0"></summary-page>  
      
      <home-content v-if="status <= 2"></home-content>        
      
    </div>

    
    

  </div>
  
</template>
<script>
  import Mixins from '@/Mixins'
  import FormSearch from '@/components/forms/FormSearch.vue'
  import BookingNav from '@/components/booking/BookingNav.vue'
  import SearchResults from '@/components/booking/SearchResults.vue'
  import SelectedVehicle from '@/components/booking/SelectedOptions.vue'
  import Spinner from '@/components/Spinner.vue'
  import FormPayment from '@/components/forms/FormPaymentNew.vue'
  import SummaryPage from '@/components/booking/Summary.vue'
  import LoadingOverlay from '@/components/LoadingOverlay.vue'
  import HomeContent from '@/components/HomeContent.vue'
  export default {
    components: {
      FormSearch,
      BookingNav,
      SearchResults,
      SelectedVehicle,
      Spinner,
      FormPayment,
      SummaryPage,
      LoadingOverlay,
      HomeContent
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
      }
    },
    
    watch: { 
      'status': {
      handler: function(status) {
        if(status == 5) {
          // ?????????
          // this.$router.push({name: 'Summary'})
        }
        if(status == 4) {
          // this.$router.push({name: 'Payment'})
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
              if (this.isEmpty(this.searchParams)) {
               this.$router.push({name: 'Search'})
             } else {
              this.status = 3
             }
           } else if (name == 'Payment') {
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
      step1() {
        return this.$store.state.step1
      },
      step2() {
        return this.$store.state.step2
      },
      step3() {
        return this.$store.state.step3
      },
      searchParams() {
        return this.$store.state.searchParams
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
      setLoading(e) {
        this.loading = e
      },
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
</style>