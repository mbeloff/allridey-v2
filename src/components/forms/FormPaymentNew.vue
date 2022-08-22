<template>
  <div class="w-full h-full p-1">
    <div
      class="mx-auto flex flex-col gap-3 flex-1 rounded py-2 relative"
      style="max-width: 400px"
    >
      <loading-overlay v-if="loading"> ...loading </loading-overlay>
      <p v-if="loading" class="font-bold text-center">Please Wait</p>
      <div ref="payForm">
        <iframe
          ref="wcframe"
          :src="payurl"
          width="400"
          height="900"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Mixins from '@/Mixins'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
export default {
  components: {
    LoadingOverlay,
  },

  mixins: [Mixins],

  data() {
    return {
      loading: true,
      url: '',
      dps: {},
      payurl: '',
      resref: '',
      confirmedPayment: {},
      paymentResponse: {},
    }
  },

  computed: {
    ...mapState(['bookinginfo', 'resinfo']),
  },

  watch: {
    paymentResponse: 'handlePayment',
    confirmedPayment: {
      handler() {
        this.trackPayment()
        this.sendEmail()
        this.$router.push({
          path: 'summary?pymnt=success',
          query: {
            pymnt: 'success',
          },
        })
      },
      deep: true,
    },
  },
  mounted() {
    this.getBookingInfo()
    window.addEventListener(
      'message',
      (event) => {
        if (
          event.origin !==
          (import.meta.env.VITE_HOST || import.meta.env.BRANCH_DEPLOY_VITE_HOST)
        ) {
          return
        } else if (event.data.TxnType) {
          this.paymentResponse = event.data
        }
      },
      false
    )
    window.scrollTo(0, 0)
  },
  methods: {
    sendEmail() {
      let params = JSON.stringify({
        method: 'sendemail',
        reservationref: this.resinfo.reservationref,
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
            pymnt: 'failed',
          },
        })
      }
      if (this.paymentResponse.Success._text == 1) {
        let params = JSON.stringify(this.gatherParams())
        Mixins.methods
          .apiCall(params)
          .then(() => {
            this.refreshBookingInfo()
          })
          .catch((err) => console.log(err))
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

    trackPayment() {
      let items = [
        {
          item_name: this.bookinginfo.bookinginfo[0].vehiclecategory,
          price: this.bookinginfo.rateinfo[0].ratesubtotal,
          quantity: 1,
          discount:
            this.bookinginfo.rateinfo[0].dailyratebeforediscount *
            this.bookinginfo.rateinfo[0].numberofdays,
        },
        {
          item_name: this.bookinginfo.bookinginfo[0].kmcharges_description,
          price: this.bookinginfo.bookinginfo[0].kmcharges_totalfordailyrate,
          quantity: 1,
        },
      ]
      this.bookinginfo.extrafees.forEach((fee) => {
        items.push({
          item_name: fee.name,
          price: fee.totalfeeamount,
          quantity: fee.qty,
        })
      })
      this.$gtag.event('purchase', {
        currency: 'AUD',
        event_category: 'ecommerce',
        transaction_id: this.bookinginfo.bookinginfo[0].reservationdocumentno,
        value: this.bookinginfo.bookinginfo[0].totalcost,
        items: items,
        coupon: this.bookinginfo.rateinfo[0].discountname.replaceAll(' ', '_'),
      })
    },

    gatherParams() {
      let obj = this.paymentResponse
      let params = {
        method: 'confirmpayment',
        reservationref:
          this.$store.state.bookinginfo.bookinginfo[0].reservationref,
        amount: obj.AmountSettlement._text,
        success: obj.Success._text,
        paytype: obj.CardName._text,
        paydate: this.getPaydate(obj.DateSettlement._text),
        supplierid: 2,
        transactid: obj.DpsBillingId._text,
        dpstxnref: obj.DpsTxnRef._text,
        cardholder: obj.CardHolderName._text,
        paysource: 'Windcave Online Payment',
        cardnumber: obj.CardNumber._text,
        cardexpiry: this.cardExpiry(obj.DateExpiry._text),
        transtype: 'Payment',
        payscenario: 1,
      }
      return params
    },

    getBookingInfo() {
      let params = JSON.stringify({
        method: 'bookinginfo',
        reservationref: this.resinfo.reservationref,
      })
      Mixins.methods.apiCall(params).then((res) => {
        this.$store.dispatch('bookinginfo', res)
        this.requestWindcaveTransaction()
      })
    },

    refreshBookingInfo() {
      let params = JSON.stringify({
        method: 'bookinginfo',
        reservationref: this.resinfo.reservationref,
      })
      Mixins.methods.apiCall(params).then((res) => {
        this.$store.dispatch('bookinginfo', res)
        this.confirmedPayment = res
      })
    },

    requestWindcaveTransaction() {
      let vault = this.$store.state.storeCardOnly
      let balancedue = this.$store.state.bookinginfo.bookinginfo[0].balancedue
      let currency = this.$store.state.bookinginfo.bookinginfo[0].currencyname
      let resref = this.$store.state.bookinginfo.bookinginfo[0].reservationref
      if (balancedue > 0) {
        let Host = import.meta.env.VITE_HOST
        // set amount to 0.00 and type to 'Validate' or 'Auth' if you just want to capture card details
        var body = JSON.stringify({
          amount: vault ? 0.0 : balancedue.toFixed(2),
          type: vault ? 'Validate' : 'Purchase',
          currency: currency,
          resref: resref,
        })
        var requestOptions = {
          method: 'POST',
          body: body,
          redirect: 'follow',
        }
        fetch(Host + '/.netlify/functions/reqtrans', requestOptions)
          .then((response) => response.text())
          .then((result) => {
            let res = JSON.parse(result).Request.URI._text
            this.payurl = res
            this.loading = false
          })
          .catch((error) => {
            console.log('request transaction failed: ', error)
          })
      } else {
        this.$router.push({
          path: '/summary?pymnt=nobal',
          query: {
            pymnt: 'nobal',
          },
        })
      }
    },
  },
}
</script>

<style lang="postcss"></style>
