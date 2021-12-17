<template>
<div class="bg-gray-300 h-full relative">
  <loading-overlay v-if="loading"></loading-overlay>
  <div class="py-10 container max-w-screen-lg mx-auto px-0 md:px-5">
    
    <div class="py-10">
      <div class="grid md:grid-flow-col gap-1 px-1">
        <label for="drivers" class="btn btn-primary" :class="{'active':tab=='drivers'}">Customer Details</label>
        <label for="extras" class="btn btn-primary" :class="{'active':tab=='extras'}">Upgrade Extras</label>
        <label for="uploads" class="btn btn-primary" :class="{'active':tab=='uploads'}">Upload Documents</label>
        <input name="drivers" id="drivers" type="radio" value="drivers" v-model="tab" hidden>
        <input name="extras" id="extras" type="radio" value="extras" v-model="tab" hidden>
        <input name="uploads" id="uploads" type="radio" value="uploads" v-model="tab" hidden>
      </div>
    </div>

    <modify-drivers @update="bookingInfo()" v-if="tab=='drivers' " :bookingdata="bookingdata" :customer="customer" :resref="resref" :totals="totals" :extradrivers="bookingdata.extradrivers"></modify-drivers>
    <modify-extras @update="bookingInfo()" v-if="tab=='extras'" :customer="customer" :initialtotals="totals" :bookingdata="bookingdata" :resref="resref" :insuranceid="insurancefee"></modify-extras>
    <modify-uploads v-if="tab=='uploads'" :resref="resref" :totals="totals" :bookingdata="bookingdata"></modify-uploads>
</div>
</div>
  
</template>

<script>
  import Mixins from '@/Mixins.js'
  import ModifyDrivers from '@/components/postbooking/ModifyDrivers.vue'
  import ModifyExtras from '@/components/postbooking/ModifyExtras.vue'
  import SectionSummary from '@/components/postbooking/BookingSummary.vue'
  import ModifyUploads from '@/components/postbooking/ModifyUploads.vue'
  import LoadingOverlay from '@/components/LoadingOverlay.vue'
  export default {
    mixins: [Mixins],
    components: {
      SectionSummary,
      ModifyUploads,
      ModifyExtras,
      LoadingOverlay,
      ModifyDrivers
    },
    data() {
      return {
        bookingdata: {},
        loading: false,
        tab: "drivers",
        totals: [],
        insurancefee: 0,
        mandatoryfees: [],
        optionalfees: [],
        resref: "",
        customer: {},
        ready: false
      }
    },
    created() {
      this.bookingInfo()
      this.resref = this.$store.state.pbresref
    },
    methods: {
      bookingInfo() {
        let resref = this.$store.state.pbresref
        this.loading = true
        this.ready = false
        let method = JSON.stringify({
          "method": "bookinginfo",
          "reservationref": resref
        });
        Mixins.methods.postapiCall(method)
          .then(res => {
            if (res.status == "OK") {
              this.loading = false
              this.init(res.results)
            } else if (res.status == "ERR") {
              console.log(res.error)
              this.$router.push({
                name: "Checkin"
              })
            }
            if (res.Message) {
              console.log(res.Message)
              this.$router.push({
                name: "Checkin"
              })
            }
            this.loading = false
          }).catch(err => {
            // this.error = err
            console.log('get booking info (error): ' + err)
            this.$router.push({
              name: "Checkin"
            })
          })
      },
      getIns(data) {
        let id = data.find(el=>el.isinsurancefee)
        return id.extrafeeid
      },
      init(data) {
        let feedata = data.extrafees
        this.bookingdata = data
        this.customer = data.customerinfo[0]
        this.insurancefee = this.getIns(feedata)
        this.mandatoryfees = this.getMans(feedata)
        this.optionalfees = this.getOpts(feedata)
        this.calcTotal()
      },
      getMans(data) {
        let fees = []
        data.forEach(el => {
          if (el.isoptionalfee == false) {
            fees.push({
              "id": el.extrafeeid,
              "qty": el.qty
            })
          }
        })
        return fees
      },
      getOpts(data) {
        let fees = []
        data.forEach(el => {
          if (el.isoptionalfee == true && el.isinsurancefee == false) {
            fees.push({
              "id": el.extrafeeid,
              "qty": el.qty
            })
          }
        })
        return fees
      },
      calcTotal() {
        this.loading = true;
        let method = JSON.stringify({
          "method": "calctotal",
          "pickuplocationid": this.bookingdata.bookinginfo[0].pickuplocationid,
          "pickupdate": this.bookingdata.bookinginfo[0].pickupdate,
          "vehiclecategoryid": this.bookingdata.bookinginfo[0].vehiclecategoryid,
          "numberofdays": this.bookingdata.bookinginfo[0].numberofdays,
          "totalrateafterdiscount": this.bookingdata.rateinfo[0].ratesubtotal,
          "freedaysamount": 0,
          "insuranceid": this.insurancefee,
          "extrakmsid": this.bookingdata.bookinginfo[0].kmcharges_id,
          "mandatoryfees": this.mandatoryfees,
          "optionalfees": this.optionalfees,
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            this.loading = false
            if (res.status == 'OK') {
              this.totals = res.results.totals
              this.ready = true
            } else if (res.status == 'ERR') {
              throw res.error
            }
          }).catch(err => {console.log(err)
            this.$router.push({name: 'Checkin', query: { "valid" : false }})
          })
      },
    }
  }
</script>

<style lang="postcss">

    .active {
      @apply from-blue-800 to-blue-900
    }
</style>