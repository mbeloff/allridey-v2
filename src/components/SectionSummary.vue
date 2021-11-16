<template>
        <div class="text-left">
          <img :src="bookingdata.bookinginfo[0].urlpathfordocuments + bookingdata.bookinginfo[0]. vehicleimage" alt="" class="m-auto">
          <div class="bg-white px-2 py-1 text-sm">
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
                {{bookingdata.rateinfo[0].numberofdays + ' days @ ' + bookingdata.bookinginfo[0].currencysymbol + bookingdata.rateinfo[0].dailyrateafterdiscount}}
              </span>
              <span class="font-bold">{{bookingdata.bookinginfo[0].currencysymbol + bookingdata.rateinfo[0].ratesubtotal.toFixed(2)}}</span>
            </div>

            <div class="">
              <p class="font-bold">Fees:</p>
              <div class="flex justify-between" v-for="fee in bookingdata.extrafees" :key="fee.extrafeeid">
                <span> {{fee.name}} </span><span class="font-bold">{{bookingdata.bookinginfo[0].currencysymbol + fee.totalfeeamount.toFixed(2)}}</span>
              </div>
              <div class="flex justify-between">
                <span> {{bookingdata.bookinginfo[0].kmcharges_description}} </span><span class="font-bold ml-5">{{bookingdata.bookinginfo[0].currencysymbol + bookingdata.bookinginfo[0].kmcharges_totalfordailyrate.toFixed(2)}}</span>
              </div>
              <br>
            </div>

            <div v-if="bookingdata.paymentinfo.length != 0" class="flex justify-end">
              <span>Payment received:</span><span>{{bookingdata.bookinginfo[0].currencysymbol + bookingdata.bookinginfo[0].payment}}</span>
            </div>
          </div>

          <div class="bg-blue-800 text-blue-100 p-2">
            <div class="flex justify-end mb-2">
              <span v-if="bookingdata.bookinginfo[0].isquotation" class="font-bold mr-2 ">TOTAL: </span>
              <span v-else class="font-bold mr-2 ">BALANCE DUE: </span>
              <span class="text-right">{{bookingdata.bookinginfo[0].currencyname + ' ' + bookingdata.bookinginfo[0].currencysymbol + bookingdata.bookinginfo[0].balancedue.toFixed(2)}}</span>
            </div>
            <div class="text-right italic text-xs">
              <span>includes GST of: </span><span> {{ bookingdata.bookinginfo[0].currencysymbol + bookingdata.bookinginfo[0].gst }}</span>
            </div>
          </div>
          
        </div>
</template>

<script>
export default {
  props: {
    bookingdata: Object
  },
  methods: {
      tConvert (time) {
        // Check correct time format and split into components

        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
      }
    }
}
</script>

<style>

</style>