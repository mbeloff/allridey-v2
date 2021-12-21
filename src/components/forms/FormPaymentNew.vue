<template>
  <div class="w-full h-full p-1">
    <div class="mx-auto flex flex-col gap-3 flex-1 bg-white rounded shadow-xl py-2 relative" style="max-width: 400px">
      <loading-overlay v-if="loading">
        ...loading
      </loading-overlay>
      <p class="font-bold text-center">Payment</p>
      <div v-if="paymentResponse.Success && paymentResponse.Success._text == 0">
        <p class="bg-yellow-500 text-yellow-900 text-sm">{{paymentResponse.ResponseText._text}}</p>
      </div>

      <div>
        <iframe ref="wcframe" :src="payurl" width="400" height="750" scrolling="no"></iframe>
      </div>
      <div class="text-left pl-2">
        <!-- <a @click="this.$router.push(
          {path: 'summary?pymnt=failed', query: {pymnt: 'failed'} })" class="text-red-500 text-sm italic cursor-pointer">cancel & save as quote?</a> -->
      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '@/Mixins'
  import LoadingOverlay from '@/components//LoadingOverlay.vue'
  export default {
    components: {
      LoadingOverlay
    },
    props: {
      reservation: Object
    },
    data() {
      return {
        loading: true,
        url: "",
        dps: {},
        payurl: "",
        resref: "",
        confirmedPayment: {},
        paymentResponse: {}
      }
    },
    mounted() {
      this.getBookingInfo()
      window.addEventListener("message", (event) => {
        if (event.origin !==
          import.meta.env.VITE_HOST) {
          return;
        } else if (event.data.TxnType) {
          this.paymentResponse = event.data
        }
      }, false);
    },
    mixins: [Mixins],
    computed: {},
    watch: {
      'paymentResponse': 'handlePayment',
      'confirmedPayment': function () {
        this.$router.push({
          path: 'summary?pymnt=success',
          query: {
            pymnt: 'success'
          }
        })
      }
    },
    methods: {
      handlePayment() {
        this.loading = true
        if (this.paymentResponse.CardHolderName._text == 'User Cancelled') {
          this.$router.push({name: 'Summary'})
        }
        if (this.paymentResponse.Success._text == 1) {   
        let params = JSON.stringify(this.gatherParams())
        Mixins.methods.apiCall(params).then(res => {
          
          this.refreshBookingInfo()
        }).catch(err => console.log(err))
        } else if (this.paymentResponse.Success._text == 0) {      
          this.requestWindcaveTransaction()
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
          "reservationref": this.$store.state.bookinginfo.bookinginfo[0].reservationref,
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
          "emailoption": 1
        }
        return params
      },
      getBookingInfo() {
        let params = JSON.stringify({
          "method": "bookinginfo",
          "reservationref": this.reservation.reservationref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.$store.dispatch('bookinginfo', res)
          this.requestWindcaveTransaction()
        })
      },
      refreshBookingInfo() {
        let params = JSON.stringify({
          "method": "bookinginfo",
          "reservationref": this.reservation.reservationref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.$store.dispatch('bookinginfo', res)
          this.confirmedPayment = res
        })
      },
      requestWindcaveTransaction() {
        let balancedue = this.$store.state.bookinginfo.bookinginfo[0].balancedue
        let currency = this.$store.state.bookinginfo.bookinginfo[0].currencyname
        let resref = this.$store.state.bookinginfo.bookinginfo[0].reservationref
        if (balancedue > 0) {
          let Host =
            import.meta.env.VITE_HOST


          var body = JSON.stringify({
            amount: balancedue,
            currency: currency,
            resref: resref
          });
          var requestOptions = {
            method: 'POST',
            body: body,
            redirect: 'follow'
          };
          fetch(Host + "/.netlify/functions/reqtrans", requestOptions)
            .then(response => response.text())
            .then(result => {
              let res = JSON.parse(result).Request.URI._text
              this.payurl = res
              this.loading = false
            })
            .catch(error => {
              console.log('request transaction failed: ', error)
            });
        } else {
          this.$router.push({
            path: "/summary?pymnt=nobal",
            query: {
              pymnt: 'nobal'
            }
          })
        }

      }
    }
  }
</script>

<style lang="postcss">
</style>