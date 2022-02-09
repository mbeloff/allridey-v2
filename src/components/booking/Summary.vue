<template>
  <div ref="summary" class="text-left p-2">
    <loading-overlay v-if="loading"></loading-overlay>
    <!-- <div class="rounded max-w-md mx-auto p-2 flex flex-row gap-3 mb-10 bg-red-100 border-red-300 border items-center text-red-700" v-if="pymnt == 'failed'">
     <i class="far fa-exclamation fa-fw"></i><p>Sorry, your payment was unsuccessful. We've saved your request as a quote. 
       </p>
    </div> -->
    <div class="rounded max-w-md mx-auto p-2 flex flex-row gap-3 mb-10 bg-green-100 border-green-300 border items-center text-green-700" v-if="pymnt == 'success'">
     <i class="far fa-check fa-fw"></i><p>Payment Successful.</p>
    </div>
    <div class="rounded w-full flex flex-col gap-3">
      <div class="flex flex-col md:flex-row gap-3 items-start">

        <!--LEFT SIDE -->
        <div class="md:w-2/6 order-2 md:order-1 bg-white shadow-xl rounded">
        
          <img :src="booking.urlpathfordocuments + booking.vehicleimage" alt="" class="m-auto rounded-t">
          <div class="bg-white px-2 py-1 text-sm">
           <div class="w-full flex gap-3 items-center text-sm text-gray-500 py-4">
            <div class="text-right flex-grow">
              <p class="uppercase text-sm font-bold text-gray-500 mb-1">Picking Up</p>
              <ul>
                <li>{{bookinginfo.bookinginfo[0].pickuplocationname}}</li>
                <li>{{bookinginfo.bookinginfo[0].pickupdate.replaceAll('/', ' ') + ' ' + tConvert(bookinginfo.bookinginfo[0].pickuptime)}}</li>

              </ul>
            </div>
            <div class="flex-shrink grid place-items-center">
              <div class="grid grid-flow-col place-items-center">
                <i class="fal fa-ellipsis-h mr-0.5"></i> <i class="fal fa-arrow-right"></i>
              </div>

            </div>
            <div class="text-left flex-grow ">
              <p class="uppercase text-sm font-bold text-gray-500 mb-1">Dropping Off</p>
              <ul>
                <li>{{bookinginfo.bookinginfo[0].dropofflocationname}}</li>
                <li>{{bookinginfo.bookinginfo[0].dropoffdate.replaceAll('/', ' ') + ' ' + tConvert(bookinginfo.bookinginfo[0].dropofftime)}}</li>

              </ul>
            </div>
          </div>
            <p class="font-bold">Daily Rental Rate:</p>
            <div class="flex justify-between py-2">
              <span class="flex-shrink">
                {{rate[0].numberofdays + ' days @ ' + booking.currencysymbol + rate[0].dailyrateafterdiscount}}
              </span>
              <span class="font-bold">{{booking.currencysymbol + rate[0].ratesubtotal.toFixed(2)}}</span>
            </div>

            <!-- EXTRAS -->
            <div class="">
              <p class="font-bold">Fees:</p>
              <div class="flex justify-between" v-for="fee in fees" :key="fee">
                <span> {{fee.name}} </span><span class="font-bold">{{booking.currencysymbol + fee.totalfeeamount.toFixed(2)}}</span>
              </div>
              <div class="flex justify-between">
                <span> {{booking.kmcharges_description}} </span><span class="font-bold ml-5">{{booking.currencysymbol + booking.kmcharges_totalfordailyrate.toFixed(2)}}</span>
              </div>
              <br>
            </div>

            <div v-if="payment.length != 0" class="flex justify-end">
              <span>Payment received:</span><span>{{booking.currencysymbol + booking.payment}}</span>
            </div>
            <div v-else-if="this.$route.query.pymnt == 'failed'" class="flex justify-end">
              <span class="italic">no payment received</span>
            </div>
          </div>

          <!-- CALCULATED TOTAL -->
          <div class="bg-blue-900 text-white px-2 rounded-b py-1">
            <div class="flex justify-end">
              <span class="font-bold mr-2 ">TOTAL COST: </span>
              <span class="text-right">{{booking.currencyname + ' ' + booking.currencysymbol}}</span>
              <!-- // ? id for  -->
              <span v-if="booking.isquotation">{{booking.totalcost.toFixed(2)}}</span>
              <span v-else id="booktotal">{{booking.totalcost.toFixed(2)}}</span>
              
            </div>
            <div class="text-right italic text-xs">
              <span>(includes GST of: </span><span> {{ booking.currencysymbol + booking.gst }})</span>
            </div>
            <div v-if="payment.length != 0" class="flex justify-end mt-2 text-sm">
              <span class="font-bold mr-2 ">BALANCE DUE: </span>
              <span class="text-right">{{booking.currencyname + ' ' + booking.currencysymbol}}</span><span>{{booking.balancedue.toFixed(2)}}</span>
            </div>            
          </div>          
        </div>

        <!-- RIGHT SIDE -->
        <div class="flex flex-col md:w-4/6 flex-shrink order-1 md:order-2">
        <div class="flex flex-col shadow-xl bg-gray-200 p-5 gap-2 py-10 mb-5 rounded">
          <p v-if="booking.isquotation" class='text-xl font-bold'>Thank you for requesting a quote with Allridey</p>
          <p v-else class='text-xl font-bold'>Thanks for booking with Allridey.</p>
          
          <p class="text-sm" v-if="pymnt == 'failed'">No payment was received, we've saved your request as a quote.</p>
          <p class="text-sm"><span v-if="booking.isquotation">You can convert this quote into a booking by clicking the button below.</span></p>
          <div class="grid grid-cols-2 text-sm">
            <span class="font-bold">Reference number:</span>
            <span class="font-bold" id="booknumber">{{ booking.reservationdocumentno }}</span>
            <span class="font-bold">Reservation Type:</span>
            <span>{{ booking.reservationstatus }}</span>
            <span class="font-bold">Name:</span><span>{{ customer.firstname }} {{ customer.lastname }}</span>
            <span class="font-bold">Email:</span><span class="break-all">{{customer.email}}</span>
          </div>
          <p class="text-xs">We've sent you an email for your records.</p>
        </div>
        <div class="flex">
          <a v-if="booking.isquotation" :href="booking.quoteconversionurl" class="btn btn-primary text-center mx-auto mb-2">Convert to Booking</a>
        </div>
        
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue'
  import Mixins from '@/Mixins'
  export default {
    mixins: [Mixins],
    components: {LoadingOverlay},
    data() {
      return {
        booking: {},
        pymnt: undefined,
        loading: true
      }
    },
    beforeMount() {
      this.booking = this.$store.state.bookinginfo.bookinginfo[0],
      this.pymnt = this.$route.query.pymnt
    },
    mounted() {
      // this.sendEmail()
      this.loading = false
      window.scrollTo(0,0);  
    },
    computed: {
      bookinginfo() {
        return this.$store.state.bookinginfo
      },
      customer() {
        return this.$store.state.bookinginfo.customerinfo[0]
      },
      company() {
        return this.$store.state.bookinginfo.companyinfo[0]
      },
      drivers() {
        return this.$store.state.bookinginfo.extradrivers
      },
      fees() {
        return this.$store.state.bookinginfo.extrafees
      },
      payment() {
        return this.$store.state.bookinginfo.paymentinfo
      },
      rate() {
        return this.$store.state.bookinginfo.rateinfo
      }
    },
    methods: {
      tConvert (time) {
        // Check correct time format and split into components
        time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
      },
      // sendEmail() {
      //   let params = JSON.stringify({
      //     "method":"sendemail",
      //     "reservationref":this.booking.reservationref,
      //   })
      //   Mixins.methods.apiCall(params)
      // }
    },
  }
</script>

<style>

</style>