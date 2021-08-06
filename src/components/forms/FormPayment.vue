<template>
  <div class="w-full h-full p-1">
    <div class="mx-auto flex flex-col gap-3 flex-1 bg-white rounded shadow-xl py-2 relative" style="max-width: 400px">
      <loading-overlay v-if="loading"></loading-overlay>
      <p class="font-bold text-center">Payment</p>
      <!-- <div v-if="bookinginfo" class="container max-w-md mx-auto p-2">
          <p class="text-left">Booking total: {{bookinginfo.bookinginfo[0].currencyname}}{{bookinginfo.currencysymbol}} {{bookinginfo.bookinginfo[0].balancedue.toFixed(2)}}</p>
        </div> -->
      <!-- <div class=" relative mx-auto grid place-items-center" style="width: 371px">
          <div v-if="!frameLoad" class="absolute grid place-items-center">
            <spinner class=" text-blue-500" ></spinner>
            <p>Please wait...</p>
          </div>
          
          <iframe ref="vault" :src="url" frameborder="0" class="vault" height="243" width="371"></iframe>
          <div v-if="frameLoad" class="p-2">
            <div class="flex items-center gap-2">
              <i class="fab fa-cc-visa fa-2x"></i>
              <i class="fab fa-cc-mastercard fa-2x"></i>
              <img class="w-1/2" src="../assets/wcave.svg" alt="Windcave Footer Logo" title="Windcave Footer Logo">
            </div>
            <p class="text-sm">{{vaultnote}}</p>
          </div>        
        </div> -->
      <div>
        <iframe ref="wcframe" :src="dps.RedirectUrl" width="400" height="470" scrolling="no"></iframe>
      </div>
      <div class="text-left pl-2">
        <router-link :to="{name: 'Summary'}" class="text-red-500 text-sm italic">cancel & save as quote</router-link>
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
        loading: true,
        frameLoad: false,
        url: "",
        vaultnote: "",
        vaultresponse: "",
        // bookinginfo: "",
        dps: {},
        query: "",
        resref: "",
        resno: "",
        customerid: "",
      }
    },
    mounted() {
      this.getBookingInfo()
      let iframe = this.$refs.wcframe
      // iframe.onload = function () {        
      //   try {
      //     const queryString = iframe.contentWindow.location.search;
      //     console.log('iframe onload - qstring= ' + queryString)
      //     this.query = new URLSearchParams(queryString);
          
      //   } catch (e) {}
      // }
      

      // this.getVaultUrl()
      // let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent"
      // let eventer = window[eventMethod]
      // let messageEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message'

      // // listen to message from child window needed for vault page
      // let _comp = this
      // eventer (messageEvent, function myFunction(e){
      //   var key = e.message ? "message" : "data"
      //   var data = e[key]
      //   // run function
      //   if (data.length > 4) {
      //     var split = data.split(',')
      //     if (split[5] == 'ADD') {
      //     _comp.vaultresponse = data
      //     _comp.$forceUpdate()
      //     _comp.vaultEntry()
      //     window.removeEventListener(messageEvent, myFunction)
      //   }
      //   }
      // }, false)


      // check iframe loaded
      // var _this = this
      // const iframe = this.$refs.vault
      // // handle compatible line problem
      // if (iframe.attachEvent) {
      //   iframe.attachEvent('onload', function () {
      //             _this.setframeloaded()
      //   })
      // } else {
      //   iframe.onload = function () {
      //              _this.setframeloaded()
      //   }
      // }
      
    },
    mixins: [Mixins],
    computed: {},
    watch: {
      // 'bookinginfo': {
      //   handler: function() {
      //     if (this.$store.state.bookinginfo.bookinginfo[0].balancedue) {
      //       console.log('balance = ' + this.$store.state.bookinginfo.bookinginfo[0].balancedue)
      //       return
      //     } else {
      //       console.log('no balance. redirecting to summary')
      //       this.$router.push({ query: {paid: 'true'}})
      //       this.$router.push({name: "Summary"})

      //     }
      //   }
      // }
    },
    computed: {
      resinfo() {
        return this.$store.state.resinfo
      },
      bookinginfo() {
        return this.$store.state.bookinginfo
      }
    },
    methods: {
      // setframeloaded(){
      //   this.frameLoad = true
      // },
      getBookingInfo() {
        let params = JSON.stringify({
          "method":"bookinginfo",
          "reservationref":this.reservation.reservationref
        })
        Mixins.methods.apiCall(params).then(res => {
          this.$store.dispatch('bookinginfo', res)
          // this.bookinginfo = res
          this.createDPSpayment()
        })
      },
      // vaultEntry() {
      //   let params = JSON.stringify({
      //     "method":"vaultentry",
      //     "reservationref":this.reservation.reservationref,
      //     "data":btoa(this.vaultresponse),
      //     "payscenario":1,
      //     // ! set email option
      //     "emailoption":0
      //   })
      //   Mixins.methods.apiCall(params).then(res => {
      //     console.log(res)
      //     if(res.paymentsaved == true) {
      //       this.$emit('paymentSaved', JSON.stringify(this.reservation))
      //     }
      //   })
      // },
      // getVaultUrl(){
      //   let params = JSON.stringify(
      //     {"method":"getvaulturl","reservationref":this.reservation.reservationref}
      //   )
      //   Mixins.methods.apiCall(params).then(res => {
      //     this.vaultnote = res.vaultnote
      //     this.url = atob(res.url)
      //     })
      // },
      createDPSpayment() {
        let host = import.meta.env.VITE_HOST
        let balancedue = this.$store.state.bookinginfo.bookinginfo[0].balancedue
        if (balancedue > 0) {
          let params = JSON.stringify({
            "method": "createdpspayment",
            "reservationref": this.reservation.reservationref,
            "amount": 1,
            // "amount": balancedue,
            "returnurl": host + "/checkpayment?payment=1&ref=" + this.reservation.reservationref + "&resno=" + this.reservation.reservationno + "&customerid=" + this.reservation.customerid,
            "transationtype": "Purchase"
          })
          Mixins.methods.apiCall(params).then(res => {
            this.dps = res
            this.loading = false
          })
        } else {
          console.log('no balance due')
          // this.$emit('grabBookingInfo')
          this.$router.push({path: "/summary?pymnt=nobal", query: {pymnt: 'nobal'}})
        }

      }
    }
  }
</script>

<style lang="postcss">
</style>