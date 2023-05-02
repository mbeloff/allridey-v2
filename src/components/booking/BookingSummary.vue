<template>
  <div v-if="booking" ref="summary" class="p-2 text-left">
    <loading-overlay v-if="loading" />
    <div class="flex flex-col w-full gap-3 rounded">
      <div class="flex flex-col items-start gap-3 md:flex-row">
        <!--LEFT SIDE -->
        <div class="order-2 bg-white rounded shadow-xl md:w-2/6 md:order-1">
          <img
            :src="booking.urlpathfordocuments + booking.vehicleimage"
            alt=""
            class="m-auto rounded-t"
          />
          <div class="px-2 py-1 text-sm bg-white">
            <div
              class="flex items-center w-full gap-3 py-4 text-sm text-gray-500"
            >
              <div class="flex-grow text-right">
                <p class="mb-1 text-sm font-bold text-gray-500 uppercase">
                  Picking Up
                </p>
                <ul>
                  <li>{{ booking.pickuplocationname }}</li>
                  <li>
                    {{
                      booking.pickupdate.replaceAll('/', ' ') +
                      ' ' +
                      tConvert(booking.pickuptime)
                    }}
                  </li>
                </ul>
              </div>
              <div class="grid flex-shrink place-items-center">
                <div class="grid grid-flow-col place-items-center">
                  <i class="fal fa-ellipsis-h mr-0.5" />
                  <i class="fal fa-arrow-right" />
                </div>
              </div>
              <div class="flex-grow text-left">
                <p class="mb-1 text-sm font-bold text-gray-500 uppercase">
                  Dropping Off
                </p>
                <ul>
                  <li>{{ booking.dropofflocationname }}</li>
                  <li>
                    {{
                      booking.dropoffdate.replaceAll('/', ' ') +
                      ' ' +
                      tConvert(booking.dropofftime)
                    }}
                  </li>
                </ul>
              </div>
            </div>
            <p class="font-bold">Daily Rental Rate:</p>
            <div class="flex justify-between py-2">
              <span class="flex-shrink">
                {{
                  rate[0].numberofdays +
                  ' days @ ' +
                  booking.currencysymbol +
                  rate[0].dailyrateafterdiscount
                }}
              </span>
              <span class="font-bold">{{
                booking.currencysymbol + rate[0].ratesubtotal.toFixed(2)
              }}</span>
            </div>

            <!-- EXTRAS -->
            <div class="">
              <p class="font-bold">Fees:</p>
              <div v-for="fee in fees" :key="fee" class="flex justify-between">
                <span> {{ fee.name }} </span
                ><span class="font-bold">{{
                  booking.currencysymbol + fee.totalfeeamount.toFixed(2)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span> {{ booking.kmcharges_description }} </span
                ><span class="ml-5 font-bold">{{
                  booking.currencysymbol +
                  booking.kmcharges_totalfordailyrate.toFixed(2)
                }}</span>
              </div>
              <br />
            </div>

            <div v-if="payment.length != 0" class="flex justify-end">
              <span>Payment received:</span
              ><span>{{ booking.currencysymbol + booking.payment }}</span>
            </div>
            <div
              v-else-if="$route.query.pymnt == 'failed'"
              class="flex justify-end"
            >
              <span class="italic">no payment saved</span>
            </div>
          </div>

          <!-- CALCULATED TOTAL -->
          <div class="px-2 py-4 text-white bg-blue-900 rounded-b">
            <div class="flex justify-end">
              <span class="mr-2 font-bold">TOTAL COST: </span>
              <span class="text-right">{{
                booking.currencyname + ' ' + booking.currencysymbol
              }}</span>
              <span id="booktotal">{{ booking.totalcost.toFixed(2) }}</span>
            </div>
            <!-- <div
              class="text-xs italic text-right"
            >
              <span>(includes GST of: </span
              ><span> {{ booking.currencysymbol + booking.gst }})</span>
            </div> -->
            <div
              v-if="payment.length != 0"
              class="flex justify-end mt-2 text-sm"
            >
              <span class="mr-2 font-bold">BALANCE DUE: </span>
              <span class="text-right">{{
                booking.currencyname + ' ' + booking.currencysymbol
              }}</span
              ><span>{{ booking.balancedue.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="flex flex-col flex-shrink order-1 md:w-4/6 md:order-2">
          <div
            class="flex flex-col gap-2 p-5 py-10 mb-5 bg-gray-200 rounded shadow-xl"
          >
            <p v-if="booking.isquotation" class="text-xl font-bold">
              Thank you for requesting a quote with Allridey
            </p>
            <p v-else class="text-xl font-bold">
              Thank you for booking with Allridey.
            </p>

            <p v-if="pymnt == 'failed'" class="text-sm">
              No payment info was saved, we've kept your request as a quote.
            </p>
            <p class="text-sm">
              <span v-if="booking.isquotation"
                >You can convert this quote into a booking by clicking the
                button below.</span
              >
            </p>
            <div class="grid grid-cols-2 text-sm">
              <span class="font-bold">Reference number:</span>
              <span id="booknumber" class="font-bold">{{
                booking.reservationdocumentno
              }}</span>
              <span class="font-bold">Reservation Type:</span>
              <span>{{ booking.reservationstatus }}</span>
              <span class="font-bold">Name:</span
              ><span>{{ customer.firstname }} {{ customer.lastname }}</span>
              <span class="font-bold">Email:</span
              ><span class="break-all">{{ customer.email }}</span>
            </div>

            <p v-if="booking.agent" class="text-xs">
              An copy of this request has been emailed to
              {{ booking.agentemail }}.
            </p>
            <p v-else class="text-xs">
              We've sent you an email for your records.
            </p>
          </div>
          <div class="flex">
            <a
              v-if="booking.isquotation"
              :href="
                'https://checkin.allridey.com.au/?name=' +
                customer.email +
                '&res=' +
                booking.reservationno
              "
              class="mx-auto mb-2 text-center btn btn-primary"
              >Convert to a Booking</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import Mixins from '@/Mixins'
export default {
  components: { LoadingOverlay },
  mixins: [Mixins],
  data() {
    return {
      pymnt: undefined,
      loading: true,
    }
  },
  computed: {
    ...mapState({
      booking: (state) => state.bookinginfo.bookinginfo[0],
      customer: (state) => state.bookinginfo.customerinfo[0],
      fees: (state) => state.bookinginfo.extrafees,
      payment: (state) => state.bookinginfo.paymentinfo,
      rate: (state) => state.bookinginfo.rateinfo,
    }),
  },
  beforeMount() {
    this.pymnt = this.$route.query.pymnt
  },
  mounted() {
    this.loading = false
    window.scrollTo(0, 0)
  },
  methods: {
    tConvert(time) {
      // Check correct time format and split into components
      time = time
        .toString()
        .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

      if (time.length > 1) {
        // If time format correct
        time = time.slice(1) // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM' // Set AM/PM
        time[0] = +time[0] % 12 || 12 // Adjust hours
      }
      return time.join('') // return adjusted time or original string
    },
  },
}
</script>

<style></style>
