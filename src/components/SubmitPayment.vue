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
      }
    },
    mixins: [Mixins],
    mounted() {
      this.paymentinfo = this.$route.query
      this.getDPSpayment()
    },
    watch: {
      'paymentStatus': function () {
        if (this.paymentStatus.Status == 'Failed') {
          console.log('Payment Failed, redirecting to summary') 
          this.payfinished()        
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
          this.payfinished() 
        }  
      }
    },
    methods: {
      payfinished() {
        this.$emit('payFinished', this.paymentinfo.ref)
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
          "transactid": this.paymentStatus.TransactionId,
          "dpstxnref": this.paymentStatus.RebillingToken,         
          "paysource": "Windcave Online Payment",
          // "cardholder": "fred",
          // "cardnumber": "############1111",
          // "cardexpiry": "01/23",
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