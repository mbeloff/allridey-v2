<template>
  <div class="w-full h-full p-1">
    <div class="mx-auto flex flex-col gap-3 flex-1 rounded py-2 relative" style="max-width: 400px">
      <loading-overlay v-if="loading">
        ...loading
      </loading-overlay>
      <p v-if="loading" class="font-bold text-center">Please Wait</p>
      <div v-if="paymentResponse.Success && paymentResponse.Success._text == 0">
        <p class="bg-yellow-500 text-yellow-900 text-sm">{{paymentResponse.ResponseText._text}}</p>
      </div>

      <div ref="payForm">
        <iframe ref="wcframe" :src="payurl" width="400" height="900" scrolling="no"></iframe>
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
      reservation: Object,
      bookingdata: Object
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

      window.scrollTo(0, 0);
    },
    mixins: [Mixins],
    computed: {},
    watch: {
      'paymentResponse': 'handlePayment',
      'confirmedPayment': {
        handler () {
          console.log('payment confirmed')
          this.trackPayment(this.bookingdata)
          this.sendEmail()
          this.$router.push({
            path: 'summary?pymnt=success',
            query: {
              pymnt: 'success'
            }
          })
        },
        deep: true
      }
    },
    methods: {
      sendEmail() {
        let params = JSON.stringify({
          "method": "sendemail",
          "reservationref": this.reservation.reservationref,
        })
        Mixins.methods.apiCall(params)
      },
      handlePayment() {
        this.loading = true
        if (this.paymentResponse.CardHolderName._text == 'User Cancelled') {
          this.sendEmail()
          this.$router.push({
            path: 'summary?pymnt=failed',
            query: {
              pymnt: 'failed'
            }
          })
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
      trackPayment(data) {
        let items = [{
            item_name: data.bookinginfo[0].vehiclecategory,
            price: data.rateinfo[0].ratesubtotal,
            quanity: 1,
            discount: data.rateinfo[0].dailyratebeforediscount * data.rateinfo[0].numberofdays
          }]
        data.extrafees.forEach(fee => {
          items.push({
            'item_name': fee.name,
            'price' : fee.totalfeeamount,
            'quantity': fee.qty,
          })
        })
        this.$gtag.event('purchase',{
          currency: "AUD",
          'event_category' : 'ecommerce',
          transaction_id: data.bookinginfo[0].reservationdocumentno,
          value: data.bookinginfo[0].totalcost,
          items: items,
          coupon: data.rateinfo[0].discountname.replaceAll(' ','_')
        })
      },
      gatherParams() {
        let obj = this.paymentResponse
        let params = {
          "method": "confirmpayment",
          "reservationref": this.$store.state.bookinginfo.bookinginfo[0].reservationref,
          "amount": obj.AmountSettlement._text,
          "success": obj.Success._text,
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
            amount: balancedue.toFixed(2),
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