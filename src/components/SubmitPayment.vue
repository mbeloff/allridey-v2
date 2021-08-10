// ? not currently used
<template>
  <div class="grid place-items-center h-full">
    <div class="text-center grid place-items-center p-10 bg-white rounded shadow-xl">
      <spinner></spinner>
      <p>Subitting Payment... </p>
    </div>
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  import Spinner from './Spinner.vue'
  export default {
    components: {Spinner},
    data() {
      return {
        paymentinfo: {},
        paymentStatus: {},
        confirmedPayment: {},
        resinfo: {
          reservationref: "",
          reservationno: "",
          customerid: ""
        }      
      }
    },
    mixins: [Mixins],
    mounted() {
      this.paymentinfo = this.$route.query
      this.resinfo.reservationref = this.$route.query.ref
      this.resinfo.reservationno = this.$route.query.resno
      this.resinfo.customerid = this.$route.query.customerid
      this.getDPSpayment()
    },
    watch: {
      'paymentStatus': function () {
        if (this.paymentStatus.Status == 'Failed') {
          console.log('Payment Failed, redirecting to summary') 
          this.getBookingInfo(this.resinfo.reservationref)
          this.payfinished('failed')  
           
        }
        if (this.paymentStatus.Status == 'Approved') {
          console.log('Payment Approved, redirecting to summary')
          if ((Object.keys(this.confirmedPayment).length === 0)) {
          this.confirmPayment()
          }                
        }
      },
      'confirmedPayment': function () {
        if ((Object.keys(this.confirmedPayment).length != 0)) {
          this.payfinished('success') 
        }  
      }
    },
    methods: {
      payfinished(e) {
        console.log('payfinished')
        this.$store.dispatch('resinfo', this.resinfo)
        this.$store.dispatch('gotBooking', true)        
        this.$router.push(
          {path: 'summary?pymnt='+e, query: {pymnt: e}})
      },
      getBookingInfo(ref) {
        console.log('getBookingInfo ref = ' + ref)
        let params = JSON.stringify({
          "method":"bookinginfo",
          "reservationref":ref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.$store.dispatch('bookinginfo', res)
          this.$store.dispatch('gotBooking', true)
        })
      },  
      async getDPSpayment() {
        let params = JSON.stringify({
          "method": "getdpspayment",
          "reservationref": this.$route.query.ref,
          "result": this.$route.query.result
        })
        Mixins.methods.apiCall(params).then(res =>  this.paymentStatus = res)
      },
      async confirmPayment() {
        let params = JSON.stringify({
          "method": "confirmpayment",
          "reservationref": this.paymentinfo.ref,
          // "amount": this.paymentStatus.Amount,
          "amount": 1,
          "success": true,
          "paytype": "Credit Card",
          "paydate": new Date().toLocaleDateString(),
          "supplierid": 2,
          "transactid": this.paymentStatus.RebillingToken,
          "dpstxnref": this.paymentStatus.TransactionId,         
          "paysource": "Windcave Online Payment",
          // "cardholder": "",
          // "cardnumber": "############1111",
          // "cardexpiry": "",
          "transtype": "Payment",
          // "merchfeeid": 1,
          "payscenario": 1,
          // ! email option 0=off 1=default 2=send
          "emailoption": 0
        })
        Mixins.methods.apiCall(params).then(res => {
          console.log(res), this.confirmedPayment = res
        })
      }
    }
  }
</script>

<style>

</style>