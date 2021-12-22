<template>
  <div>
    <div class="text-left shadow-xl bg-white rounded relative">
      <div>
        <loading-overlay v-if="loading"></loading-overlay>
        <p class="text-3xl px-2 py-3 text-center">{{ (this.bookingdata.bookinginfo[0].isquotation ? 'Quote' : 'Booking') + ' Summary'}}</p>
        <div class="px-2 py-1 text-sm">
          <div class="w-full flex gap-3 items-center text-sm text-gray-500 py-4">

            <div class="text-right flex-grow">
              <p class="uppercase text-sm font-bold text-gray-500 mb-1">Picking Up</p>
              <ul>
                <li>{{bookingdata.bookinginfo[0].pickuplocationname}}</li>
                <li>{{bookingdata.bookinginfo[0].pickupdate.replaceAll('/', ' ') + ' ' + tConvert(bookingdata.bookinginfo[0].pickuptime)}}</li>

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
                <li>{{bookingdata.bookinginfo[0].dropofflocationname}}</li>
                <li>{{bookingdata.bookinginfo[0].dropoffdate.replaceAll('/', ' ') + ' ' + tConvert(bookingdata.bookinginfo[0].dropofftime)}}</li>

              </ul>
            </div>
          </div>
          <div class="text-center py-2">
            <p class="font-bold">Vehicle Category:</p>
            <p class="py-2">{{bookingdata.bookinginfo[0].vehiclecategory}}</p>
          </div>
          <div v-if="totals && totals.length">

            <p class="font-bold text-center">Daily Rental Rate:</p>
            <div class="flex justify-between py-2">
              <span class="flex-shrink">
                {{bookingdata.rateinfo[0].numberofdays + ' days @ ' + symbol + bookingdata.rateinfo[0].dailyrateafterdiscount}}
              </span>
              <span class="font-bold">{{symbol + rate[0].total}}</span>
            </div>

            <div class="">
              <p class="font-bold text-center">Fees:</p>
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

            <div v-if="bookingdata.paymentinfo.length != 0" class="flex justify-end gap-2">
              <span>Payment received: </span><span> {{symbol + bookingdata.bookinginfo[0].payment.toFixed(2)}}</span>
            </div>
          </div>

        </div>

        <div class="bg-blue-800 text-blue-100 p-2 rounded-b relative h-16">
          <loading-overlay class="rounded-t-none " v-if="loading"></loading-overlay>
          <div class="flex justify-end mb-2" v-if="!loading">
            <span v-if="bookingdata.bookinginfo[0].isquotation" class="font-bold mr-2 ">TOTAL: </span>
            <span v-else class="font-bold mr-2 ">BALANCE DUE: </span>
            <span class="text-right" v-if="totals && totals.length">{{bookingdata.bookinginfo[0].currencyname + ' ' + symbol + (total[0].total - bookingdata.bookinginfo[0].payment).toFixed(2)}}</span>
          </div>
          <div class="text-right italic text-xs" v-if="totals && totals.length">
            <span>includes GST of: </span><span> {{ symbol + tax[0].total }}</span>
          </div>
        </div>
      </div>


    </div>
    <div v-if="total && total.length">
      <button v-show="changesAreSaved()" @click="createPayment()" class="bg-white text-yellow-400 my-4 text-3xl w-full py-2 font-bold rounded">{{bookingdata.bookinginfo[0].isquotation ? 'Convert To Booking' : 'Pay Balance'}}</button>
      <button @click="$emit('saveChanges')" v-show="!changesAreSaved()" class="bg-white text-yellow-400 my-4 text-3xl w-full py-2 font-bold rounded">save changes <i class="fal fa-cloud-upload"></i></button>
    </div>
    

    <div v-if="openPayment" class="fixed max-w-screen w-full h-screen bg-black bg-opacity-70 z-50 top-0 left-0 grid items-center justify-center px-2">
      <div class="bg-white rounded p-2 overflow-scroll">
        <loading-overlay v-if="payLoading">
        ...loading
        </loading-overlay>
        <p class="font-bold text-center">Payment</p>
        <div v-if="paymentResponse.Success">
          <p class="bg-yellow-500 text-yellow-900 text-sm">{{paymentResponse.ResponseText._text}}</p>

        </div>
        <iframe ref="wcframe" :src="payurl" width="400" height="470" scrolling="no"></iframe>
        <button @click="openPayment = false" class="italic text-red-500 text-right float-right">go back <i class="ml-1 fal fa-times-square"></i></button>
      </div>

    </div>
  </div>

</template>

<script>
  import Mixins from '@/Mixins.js'
  import LoadingOverlay from '@/components/LoadingOverlay.vue'
  export default {
    mixins: [Mixins],
    components: {
      LoadingOverlay
    },
    data() {
      return {
        payurl: "",
        payLoading: false,
        openPayment: false,
        paymentResponse: {}
      }
    },
    created() {
      this.openPayment = false
    },
    watch: {
      'paymentResponse': {
        handler(val) {
          this.handlePayment()
        },
        deep: true
      },
      
    },
    mounted() {
      window.addEventListener("message", (event) => {
        if (event.origin !==
          import.meta.env.VITE_HOST) {
          return;
        } else if (event.data.TxnType) {
          this.paymentResponse = event.data
        }
      }, false);
    },
    props: {
      bookingdata: Object,
      totals: Object,
      loading: Boolean,
      resref: String
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
      },
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
      },
      createPayment() {       
        this.payLoading = true
        this.openPayment = true
        var body = JSON.stringify({
          amount: 1,
          currency: this.bookingdata.bookinginfo[0].currencyname,
          resref: this.resref
        });
        var requestOptions = {
          method: 'POST',
          body: body,
          redirect: 'follow'
        };
        fetch(import.meta.env.VITE_HOST + "/.netlify/functions/reqtrans", requestOptions)
          .then(response => response.text())
          .then(result => {
            let res = JSON.parse(result).Request.URI._text
            this.payurl = res
            this.payLoading = false
          })
          .catch(error => {
            console.log('request transaction failed: ', error)
          });
      },
      handlePayment() {
        this.payLoading = true
        if (this.paymentResponse.Success._text == 1) {   
        let params = JSON.stringify(this.gatherParams())
        Mixins.methods.postapiCall(params).then(res => {
          if (res.status == 'OK') {
            this.openPayment = false
            this.$emit('update')
          } else if (res.status == 'ERR') {
            alert(res.error)
          }         
        })
        } else if (this.paymentResponse.Success._text == 0) {       
          this.createPayment()
          this.count++
        }  
      },
      getPaydate(dateStr) {
        let year = dateStr.substring(0, 4)
        let month = dateStr.substring(4, 6)
        let day = dateStr.substring(6, 8)
        return day + '/' + month + '/' + year
      },
      cardExpiry(dateStr) {
        let month = dateStr.substring(0, 2)
        let year = dateStr.substring(2, 4)
        return month + '/' + year
      },
      gatherParams() {
        let obj = this.paymentResponse
        let params = {
          "method": "confirmpayment",
          "reservationref": this.resref,
          "amount": obj.AmountSettlement._text,
          "success": obj.Success._text,
          // "success": 1,
          "paytype": obj.CardName._text,
          "paydate": this.getPaydate(obj.DateSettlement._text),
          "supplierid": 2,
          "transactid": obj.TxnId._text,
          "dpstxnref": obj.DpsTxnRef._text,
          "cardholder": obj.CardHolderName._text,
          "paysource": "Windcave Online Payment",
          "cardnumber": obj.CardNumber._text,
          "cardexpiry": this.cardExpiry(obj.DateExpiry._text),
          "transtype": "Payment",
          "payscenario": 1,
          "emailoption": 0
        }
        return params
      },
      changesAreSaved() {
        return this.bookingdata.bookinginfo[0].balancedue == ( this.total[0].total - this.bookingdata.bookinginfo[0].payment )
      }
    }
  }
</script>

<style>

</style>