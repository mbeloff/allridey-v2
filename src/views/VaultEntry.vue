<template>
  <div class="bg-gray-200 h-full grid place-items-center">
    <div
      class="overflow-scroll bg-white grid place-items-center gap-2 p-5 rounded-lg text-left w-[450px]"
    >
      <iframe
        v-if="vaulturl"
        :src="vaulturl"
        frameborder="0"
        width="400"
        height="270"
      ></iframe>

      <div class="flex gap-2 text-left justify-start">
        <i class="fab fa-cc-visa fa-2x"></i>
        <i class="fab fa-cc-mastercard fa-2x"></i>
      </div>
      <p class="text-sm px-4">{{ note }}</p>
    </div>
  </div>
</template>

<script>
import Mixins from '@/Mixins.js'
export default {
  mixins: [Mixins],
  props: { resref: { type: String } },
  data() {
    return {
      vaulturl: '',
      note: '',
      bookinginfo: {},
    }
  },
  computed: {},
  beforeMount() {
    this.getVaultUrl()
  },
  mounted() {
    let eventMethod = window.addEventListener
      ? 'addEventListener'
      : 'attachEvent'
    let eventer = window[eventMethod]
    let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'

    let _ = this
    eventer(messageEvent, function myFunc(e) {
      let key = e.message ? 'message' : 'data'
      let data = e[key]
      console.log(data)
      if (data) {
        let split = data.split(',')
        if (split[5] == 'ADD') {
          // save payment with rcm api
          console.log(data)
          _.vaultEntry(data)
          window.removeEventListener(messageEvent, myFunc)
        }
      }
    }),
      false
  },
  methods: {
    getVaultUrl() {
      let params = JSON.stringify({
        method: 'getvaulturl',
        reservationref: this.resref,
      })
      Mixins.methods.apiCall(params).then((result) => {
        console.log(result)
        this.vaulturl = atob(result.url)
        this.note = result.vaultnote
      })
    },
    vaultEntry(data) {
      let params = JSON.stringify({
        method: 'vaultentry',
        reservationref: this.resref,
        data: btoa(data),
        payscenario: 1,
        emailoption: 0,
      })
      Mixins.methods.apiCall(params).then((result) => {
        console.log(result)
        if (result.paymentsaved == true) {
          console.log('payment saved')
          this.refreshBookingInfo()
        } else {
          alert('payment not saved')
          this.getVaultUrl()
        }
      })
    },
    refreshBookingInfo() {
      let params = JSON.stringify({
        method: 'bookinginfo',
        reservationref: this.resref,
      })
      Mixins.methods.apiCall(params).then((res) => {
        this.$store.dispatch('bookinginfo', res)
        this.bookinginfo = res
        this.trackPayment()
        this.sendEmail()
        this.$router.push({
          name: 'Summary',
          query: {
            pymnt: 'success',
          },
        })
      })
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
    sendEmail() {
      let params = JSON.stringify({
        method: 'sendemail',
        reservationref: this.resref,
      })
      Mixins.methods.apiCall(params)
    },
  },
}
</script>

<style lang="scss"></style>
