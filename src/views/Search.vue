<template>
  <div class="bg-gray-100 h-full bg-center bg-cover relative" :class="{ 'full-bg' : this.status < 3}">
    <div class="bg-cover bg-center bg-main">
      <div class="max-w-screen-lg mx-auto flex flex-col gap-10 py-10 px-2">
        <booking-nav v-if="this.status > 2" :status="this.status"></booking-nav>
        <keep-alive>
        <form-search id="search-form" v-if="this.status < 3" @errs="showErrs" @searching="setLoading"></form-search>
        </keep-alive>
      </div>      
    </div>
    

    <div class="w-screen md:max-w-screen-lg mx-auto flex flex-col gap-5 py-10 px-2">
      <div v-if="loading" class="bg-white rounded shadow-xl w-full py-5 flex place-items-center justify-center h-48 relative">
        <loading-overlay></loading-overlay>
      </div>      
      <search-results @mounted="setLoading(false)" @select-vehicle="updateStatus(3)" v-if="this.status == 2 && step2.availablecars"  :key="this.count" ></search-results>   
      <div v-if="errs.length" class="max-w-screen-lg mx-auto bg-white shadow-xl w-full rounded flex flex-col py-10">
        <p>No results found, please adjust your search</p>
        <p class="text-sm text-red-500" v-for="err in errs">{{err}}</p>
      </div>
      <selected-vehicle @bookingMade="submit" v-if="this.status == 3 && step3"></selected-vehicle>
      <form-payment v-if="this.status == 4 && gotBooking" :reservation="resinfo" :bookingdata="bookinginfo"></form-payment>
      <summary-page v-if="this.status == 5 && gotBooking && $store.state.bookinginfo.bookinginfo.length > 0"></summary-page>  
      
      <home-content v-if="this.status < 2"></home-content>        
      
    </div>
  </div>
  
</template>
<script>
  import {mapGetters, mapState} from 'vuex'
  import Mixins from '@/Mixins'
  import FormSearch from '@/components/forms/FormSearch.vue'
  import BookingNav from '@/components/booking/BookingNav.vue'
  import SearchResults from '@/components/booking/SearchResults.vue'
  import SelectedVehicle from '@/components/booking/SelectOptions.vue'
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
      }
    },
    
    watch: {     
     '$route.name': {
        handler: function(name) {
           switch (name) {
             case 'Home' || 'Search':
               this.status = 1;
               break;
              case 'Results':
                this.step2.availablecars ? this.status = 2 : 
                this.$router.push({name: 'Search'})
                break;
              case 'Options':
                 this.step3.availablecars ? this.status = 3 : 
                 this.$router.push({name: 'Search'})
                break;
              case 'Payment':
                this.status = 4
                break
              case 'Summary':
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
      ...mapState([
        'step1',
        'step2',
        'step3',
        'searchParams',
        'bookinginfo',
        'resinfo',
        'gotBooking'
      ]),
    },
    methods: { 
      setLoading(e) {
        this.loading = e
      },
      showErrs(e) {
        this.errs = e
      },
      searching(e) {
        this.loading = e
      },
      updateStatus(e) {
        this.status = e;
      },
      updateSearchResults(e, f) {
        this.count++
        this.$forceUpdate()        
      },
      sendEmail(ref) {
        let params = JSON.stringify({
          "method":"sendemail",
          "reservationref":ref,
        })
        Mixins.methods.apiCall(params)
      },
      submit(mode, ref) {
        this.getBookingInfo(ref)
        if (mode == 1) {  
          this.sendEmail(ref)        
          this.status = 5          
          this.$router.push({name: 'Summary'})
          this.$forceUpdate()
        }
        if (mode == 2) {
          this.status = 4      
          this.$router.push({name: 'Payment'})  
        }
      },
      trackQuote() {
        this.$gtag.event('add_to_wishlist', {
          'currency': "AUD",
          'event_category' : 'ecommerce',
          'value' : this.bookinginfo.bookinginfo[0].totalcost,
          
          'items': [{
                'item_name': this.bookinginfo.bookinginfo[0].vehiclecategory,
                'price': this.bookinginfo.bookinginfo[0].totalcost,
                'item_brand': 'Allridey',
                'days': this.bookinginfo.bookinginfo[0].numberofdays,
                'discount': this.bookinginfo.rateinfo[0].dailyratebeforediscount * this.bookinginfo.rateinfo[0].numberofdays,
          }]
        })
      },
      getBookingInfo(ref) {
        let params = JSON.stringify({
          "method":"bookinginfo",
          "reservationref":ref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.$store.dispatch('bookinginfo', res)
          this.$store.dispatch('gotBooking', true)
          this.trackQuote()
        })
      },     
    }
  }
</script>

<style lang="postcss">
.bg-main {
    background-image: url(https://res.cloudinary.com/allridey/image/upload/q_auto,f_auto/c_fill,h_600,ar_1/v1639371251/assets/1823)
    }
  @media only screen and (min-width: 768px) {
    .bg-main {
    background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_fill,w_1024,ar_3/v1/allridey/1823)
    }
  }
  @media only screen and (min-width: 1024px) {
    .bg-main {
    background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_fill,w_1200,ar_3/v1/allridey/1823)
    }
  }
  @media only screen and (min-width: 1600px) {
    .bg-main {
    background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_fill,w_1600,ar_3/v1/allridey/1823)
    }
  }
  </style>
