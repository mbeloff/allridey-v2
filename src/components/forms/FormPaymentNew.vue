<template>
  <div class="w-full h-full p-1">
    <div class="mx-auto flex flex-col gap-3 flex-1 bg-white rounded shadow-xl py-2 relative" style="max-width: 400px">
      <loading-overlay v-if="loading">
        ...loading
      </loading-overlay>
      <p class="font-bold text-center">Payment</p>
      <div v-if="paymentResponse.Success._text == 0">
        <p class="bg-yellow-500 text-yellow-900 text-sm">{{paymentResponse.ResponseText._text}}</p>

      </div>

      <div>
        <iframe ref="wcframe" :src="payurl" width="400" height="470" scrolling="no"></iframe>
      </div>
      <div class="text-left pl-2">
        <a @click="this.$router.push(
          {path: 'summary?pymnt=failed', query: {pymnt: 'failed'}})" class="text-red-500 text-sm italic cursor-pointer">cancel & save as quote?</a>
      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '../../Mixins'
  import LoadingOverlay from '../LoadingOverlay.vue'
  export default {
    components: {
      LoadingOverlay
    },
    props: {
      reservation: Object
    },
    data() {
      return {
        count: 1,
        loading: true,
        frameLoad: false,
        url: "",
        vaultnote: "",
        vaultresponse: "",
        dps: {},
        payurl: "",
        query: "",
        resref: "",
        resno: "",
        confirmedPayment: {},
        customerid: "",
        paymentResponse: {
          "_attributes": {
            "valid": ""
          },
          "AmountSettlement": {
            "_text": ""
          },
          "TotalAmount": {},
          "AmountSurcharge": {},
          "AuthCode": {},
          "CardName": {
            "_text": ""
          },
          "CardNumber": {
            "_text": ""
          },
          "DateExpiry": {
            "_text": ""
          },
          "DpsTxnRef": {
            "_text": ""
          },
          "SurchargeDpsTxnRef": {},
          "Success": {
            "_text": ""
          },
          "ResponseText": {
            "_text": ""
          },
          "DpsBillingId": {},
          "CardHolderName": {
            "_text": ""
          },
          "CurrencySettlement": {
            "_text": ""
          },
          "TxnData1": {},
          "TxnData2": {},
          "TxnData3": {},
          "TxnType": {
            "_text": ""
          },
          "CurrencyInput": {
            "_text": ""
          },
          "MerchantReference": {},
          "ClientInfo": {
            "_text": ""
          },
          "TxnId": {
            "_text": ""
          },
          "EmailAddress": {},
          "BillingId": {},
          "TxnMac": {
            "_text": ""
          },
          "CardNumber2": {},
          "DateSettlement": {
            "_text": ""
          },
          "IssuerCountryId": {
            "_text": ""
          },
          "IssuerCountryCode": {},
          "Cvc2ResultCode": {
            "_text": ""
          },
          "ReCo": {
            "_text": ""
          },
          "ProductSku": {},
          "ShippingName": {},
          "ShippingAddress": {},
          "ShippingPostalCode": {},
          "ShippingPhoneNumber": {},
          "ShippingMethod": {},
          "BillingName": {},
          "BillingPostalCode": {},
          "BillingAddress": {},
          "BillingPhoneNumber": {},
          "PhoneNumber": {},
          "HomePhoneNumber": {},
          "AccountInfo": {},
          "RiskScore": {
            "_text": ""
          },
          "RiskScoreText": {}
        }
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
    computed: {
      // ? test payment flow before removing
      // resinfo() {
      //   return this.$store.state.resinfo
      // },
      // bookinginfo() {
      //   return this.$store.state.bookinginfo
      // }
    },
    methods: {
      handlePayment() {
        this.loading = true
        if (this.paymentResponse.Success._text == 1) {   
        let params = JSON.stringify(this.gatherParams())
        console.log(params)
        Mixins.methods.apiCall(params).then(res => {
          this.confirmedPayment = res
        })
        } else if (this.paymentResponse.Success._text == 0) {
          console.log('payment unsuccessful, retrying')         
          this.requestWindcaveTransaction()
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
          "reservationref": this.$store.state.bookinginfo.bookinginfo[0].reservationref,
          "amount": obj.AmountSettlement._text,
          // "success": obj.Success._text,
          "success": 1,
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
      getBookingInfo() {
        let params = JSON.stringify({
          "method": "bookinginfo",
          "reservationref": this.reservation.reservationref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.$store.dispatch('bookinginfo', res)
          // this.bookinginfo = res
          this.requestWindcaveTransaction()
        })
      },
      requestWindcaveTransaction() {
        let balancedue = this.$store.state.bookinginfo.bookinginfo[0].balancedue
        let currency = this.$store.state.bookinginfo.bookinginfo[0].currencyname
        let resref = this.$store.state.bookinginfo.bookinginfo[0].reservationref
        if (balancedue > 0) {
          let fnHost =
            import.meta.env.VITE_FN_HOST


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
          fetch(fnHost + "/.netlify/functions/reqtrans", requestOptions)
            .then(response => response.text())
            .then(result => {
              let res = JSON.parse(result).Request.URI._text
              this.payurl = res
              this.loading = false
            })
            .catch(error => {
              console.log('request transaction failed: ', error)
            });

          // let host = import.meta.env.VITE_HOST
          // let params = JSON.stringify({
          //   "method": "createdpspayment",
          //   "reservationref": this.reservation.reservationref,
          //   "amount": 1,
          //   // "amount": balancedue,
          //   "returnurl": host + "/checkpayment?ref=" + resref,
          //   "transationtype": "Purchase"
          // })
          // Mixins.methods.apiCall(params).then(res => {
          //   this.payurl = res.RedirectUrl
          //   this.loading = false
          // })

        } else {
          console.log('no balance due')
          // this.$emit('grabBookingInfo')
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