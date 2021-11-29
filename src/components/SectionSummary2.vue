<template>
<div>
  <div class="text-left shadow-xl bg-white rounded">
    <p class="text-3xl px-2 py-3">Booking Summary</p>
    <!-- <img :src="bookingdata.bookinginfo[0].urlpathfordocuments + bookingdata.bookinginfo[0]. vehicleimage" alt="" class="m-auto"> -->
    <div class="px-2 py-1 text-sm">
      <div class="flex justify-between py-2">
        <p class="font-bold">Vehicle:</p>
        <p>{{bookingdata.bookinginfo[0].vehiclecategory}}</p>
      </div>
      
      <p class="font-bold">Trip Information:</p>
      <div class="flex justify-between py-2">
        <span class="flex-shrink">
          Pickup:
        </span>
        <div class="grid font-bold">
          <span class="text-right">{{bookingdata.bookinginfo[0].pickuplocationname}}</span>
          <span>{{tConvert(bookingdata.bookinginfo[0].pickuptime)}} - {{bookingdata.bookinginfo[0].pickupdate.replaceAll('/', ' ')}}</span>
        </div>
      </div>
      <div class="flex justify-between py-2">
        <span class="flex-shrink">
          Dropoff:
        </span>
        <div class="grid font-bold">
          <span class="text-right">{{bookingdata.bookinginfo[0].dropofflocationname}}</span>
          <span>{{tConvert(bookingdata.bookinginfo[0].dropofftime)}} - {{bookingdata.bookinginfo[0].dropoffdate.replaceAll('/', ' ')}}</span>
        </div>
      </div>
      <p class="font-bold">Daily Rental Rate:</p>
      <div class="flex justify-between py-2">
        <span class="flex-shrink">
          {{bookingdata.rateinfo[0].numberofdays + ' days @ ' + symbol + bookingdata.rateinfo[0].dailyrateafterdiscount}}
        </span>
        <span class="font-bold">{{symbol + rate[0].total}}</span>
      </div>

      <div class="">
        <p class="font-bold">Fees:</p>
        <div class="flex justify-between" v-if="insurance.length">
          <span> Damage Cover </span><span class="font-bold ml-5">{{symbol + insurance[0].total}}</span>
        </div>
        <div class="flex justify-between" v-if="kms.length">
          <span> Km Charges </span><span class="font-bold ml-5">{{symbol + kms[0].total}}</span>
        </div>
        <div class="flex justify-between" v-for="fee in fees" :key="fee.id">
          <span> {{fee.name}} </span><span class="font-bold">{{symbol + fee.total}}</span>
        </div>        
        <br>
      </div>

      <div v-if="bookingdata.paymentinfo.length != 0" class="flex justify-end">
        <span>Payment received:</span><span>{{symbol + bookingdata.bookinginfo[0].payment.toFixed(2)}}</span>
      </div>
    </div>

    <div class="bg-blue-800 text-blue-100 p-2 rounded-b relative">
      <loading-overlay class="rounded-t-none" v-if="loading"></loading-overlay>
      <div class="flex justify-end mb-2">
        <span v-if="bookingdata.bookinginfo[0].isquotation" class="font-bold mr-2 ">TOTAL: </span>
        <span v-else class="font-bold mr-2 ">BALANCE DUE: </span>
        <span class="text-right">{{bookingdata.bookinginfo[0].currencyname + ' ' + symbol + (total[0].total - bookingdata.bookinginfo[0].payment).toFixed(2)}}</span>
      </div>
      <div class="text-right italic text-xs">
        <span>includes GST of: </span><span> {{ symbol + tax[0].total }}</span>
      </div>
    </div>

  </div>
  <button class="bg-white text-yellow-400 my-4 text-3xl w-full py-2 font-bold rounded">Pay Balance</button>
</div>
  
</template>

<script>
  import Mixins from '../Mixins.js'
  import LoadingOverlay from './LoadingOverlay.vue'
  export default {
    mixins: [Mixins],
    components: {
      LoadingOverlay
    },
    props: {
      bookingdata: Object,
      totals: Object,
      loading: Boolean
    },
    computed: {
      symbol() {
        return this.bookingdata.bookinginfo[0].currencysymbol
      },
      rate() {
        return this.getFees('total rate')
      },
      kms() {
        return this.getFees('kmsrate')
      },
      insurance() {
      return this.getFees('insurance')
      },
      fees() {
        return this.getFees('mandatory', 'optional')
      },
      total() {
        return this.getFees('total')
      },
      tax() {
        return this.getFees('country tax')
      }
      },
      methods: {
        getFees(type, type2) {
          let fees = []
          this.totals.forEach((el) => {
            if (el.type == type || el.type == type2) {
              fees.push({
                name: el.name,
                qty: el.qty,
                total: el.total,
                id: el.id
              })
            }
          })
          return fees
        },  
        tConvert(time) {
          // Check correct time format and split into components
          time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

          if (time.length > 1) { // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
          }
          return time.join(''); // return adjusted time or original string
        }
      }
    }
</script>

<style>

</style>