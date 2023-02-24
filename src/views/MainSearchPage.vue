<template>
  <div
    class="bg-gray-100 h-full bg-center bg-cover relative"
    :class="{ 'full-bg': step < 3 }"
  >
    <!-- <p v-if="step < 3" class="bg-red-500 text-white font-bold">
      Queenstown sale ends soon. Book Now!
    </p> -->
    <div class="bg-cover bg-center bg-main">
      <div class="max-w-screen-lg mx-auto flex flex-col gap-10 py-10 px-2">
        <booking-nav v-if="step > 2" :stage="step" />
        <keep-alive>
          <form-search
            v-if="step < 3"
            id="search-form"
            @errs="showErrs"
            @searching="setLoading"
          />
        </keep-alive>
      </div>
    </div>

    <div
      class="w-screen md:max-w-screen-lg mx-auto flex flex-col gap-5 py-10 px-2"
    >
      <div
        v-if="loading"
        class="bg-white rounded shadow-xl w-full py-5 flex place-items-center justify-center h-48 relative"
      >
        <loading-overlay />
      </div>
      <search-results
        v-if="step == 2 && step2.availablecars"
        :key="count"
        @results-mounted="setLoading(false)"
        @select-vehicle="updatestep(3)"
      />
      <div
        v-if="errs.length"
        class="max-w-screen-lg mx-auto bg-white shadow-xl w-full rounded flex flex-col py-10 px-2"
      >
        <p>No results found, please adjust your search</p>
        <p v-for="(err, i) in errs" :key="i" class="text-sm text-red-500">
          {{ err }}
        </p>
      </div>
      <selected-vehicle v-if="step == 3 && step3" @booking-made="submit" />
      <booking-summary
        v-if="
          step == 5 &&
          gotBooking &&
          $store.state.bookinginfo.bookinginfo.length > 0
        "
      />

      <home-content v-if="step < 2" />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Mixins from '@/Mixins'
import FormSearch from '@/components/forms/FormSearch.vue'
import BookingNav from '@/components/booking/BookingNav.vue'
import SearchResults from '@/components/booking/SearchResults.vue'
import SelectedVehicle from '@/components/booking/SelectOptions.vue'
import BookingSummary from '@/components/booking/BookingSummary.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import HomeContent from '@/components/HomeContent.vue'
import { useHead, useSeoMeta } from '@vueuse/head'
export default {
  components: {
    FormSearch,
    BookingNav,
    SearchResults,
    SelectedVehicle,
    BookingSummary,
    LoadingOverlay,
    HomeContent,
  },
  setup() {
    useHead({
      title: 'Cheap Car Hire Australia and New Zealand',
      titleTemplate: (title) => `${title} | Allridey`,
      link: [
        {
          rel: 'canonical',
          href: 'https://allridey.com.au/search/',
        },
      ],
    })
    useSeoMeta({
      description:
        "Allridey is the best choice for budget car rental with locations all around Australia and New Zealand. If you're looking for no-fuss car hire at great rates, you've come to the right place. Book online today",
      ogDescription:
        "Allridey is the best choice for budget car rental with locations all around Australia and New Zealand. If you're looking for no-fuss car hire at great rates, you've come to the right place. Book online today",
      ogTitle: 'Allridey Car Hire',
      ogSite_name: 'Allridey',
      url: 'https://allridey.com.au',
    })
  },
  data() {
    return {
      step: 1,
      errs: [],
      count: 0,
      vehicle: {},
      loading: false,
    }
  },
  computed: {
    ...mapState([
      'step1',
      'step2',
      'step3',
      'bookinginfo',
      'resinfo',
      'gotBooking',
      'status',
    ]),
  },
  watch: {
    '$route.name': {
      handler: function (name) {
        switch (name) {
          case 'Home':
            this.step = 1
            break
          case 'Search':
            this.step = 1
            break
          case 'Results':
            this.step2.availablecars
              ? (this.step = 2)
              : this.$router.push({
                  name: 'Search',
                })
            break
          case 'Options':
            this.step3.availablecars
              ? (this.step = 3)
              : this.$router.push({
                  name: 'Search',
                })
            break
          case 'Payment':
            this.step = 4
            break
          case 'Summary':
            this.step = 5
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // navigate to step 4.5 after payment redirect
    if (this.$route.query.payment == 1) {
      this.step = 4.5
    }
  },

  methods: {
    setLoading(e) {
      this.loading = e
    },
    showErrs(e) {
      this.errs = e
      this.loading = false
    },
    searching(e) {
      this.loading = e
    },
    updatestep(e) {
      this.step = e
    },
    // updateSearchResults(e, f) {
    //   this.count++
    //   this.$forceUpdate()
    // },
    sendEmail(ref) {
      let params = JSON.stringify({
        method: 'sendemail',
        reservationref: ref,
      })
      Mixins.methods.apiCall(params)
    },
    submit(mode, ref) {
      this.getBookingInfo(ref)
      if (mode == 1) {
        this.sendEmail(ref)
        this.step = 5
        this.$router.push({
          name: 'Summary',
        })
        this.$forceUpdate()
      }
      if (mode == 2) {
        this.step = 5
        this.$store.dispatch('vault', false)
        if (
          this.step3.availablecars[0].availablemessage.startsWith(
            'Limited availability'
          )
        ) {
          // this.$store.dispatch('vault', true)
          // send to card vault entry page
          this.$router.push({
            name: 'Checkout',
          })
        } else {
          // send to windcave payment page
          this.$router.push({
            name: 'Checkout',
          })
        }
      }
    },
    trackQuote() {
      this.$gtag.event('add_to_wishlist', {
        currency: 'AUD',
        event_category: 'ecommerce',
        value: this.bookinginfo.bookinginfo[0].totalcost,

        items: [
          {
            item_name: this.bookinginfo.bookinginfo[0].vehiclecategory,
            price: this.bookinginfo.bookinginfo[0].totalcost,
            item_brand: 'Allridey',
            days: this.bookinginfo.bookinginfo[0].numberofdays,
            discount:
              this.bookinginfo.rateinfo[0].dailyratebeforediscount *
              this.bookinginfo.rateinfo[0].numberofdays,
          },
        ],
      })
    },
    getBookingInfo(ref) {
      let params = JSON.stringify({
        method: 'bookinginfo',
        reservationref: ref,
      })
      Mixins.methods.apiCall(params).then((res) => {
        this.$store.dispatch('bookinginfo', res)
        this.$store.dispatch('gotBooking', true)
        this.trackQuote()
      })
    },
  },
}
</script>

<style lang="postcss">
.bg-main {
  background-image: url(https://res.cloudinary.com/allridey/image/upload/q_auto,f_auto/c_fill,h_600,ar_1/v1639371251/assets/1823);
}

@media only screen and (min-width: 768px) {
  .bg-main {
    background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_fill,w_1024,ar_3/v1/allridey/1823);
  }
}

@media only screen and (min-width: 1024px) {
  .bg-main {
    background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_fill,w_1200,ar_3/v1/allridey/1823);
  }
}

@media only screen and (min-width: 1600px) {
  .bg-main {
    background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_fill,w_1600,ar_3/v1/allridey/1823);
  }
}
</style>
