<template>
  <div class="py-10 container max-w-screen-lg mx-auto px-0 md:px-5 bg-gra">
    <div class="flex flex-col md:flex-row gap-3 items-start">
      <!-- LEFT SIDE -->
      <div class="w-full md:w-2/6 order-2 md:order-1 " v-if="totals.length">        
        <section-summary :bookingdata="bookingdata" :totals="totals" :loading="loading"></section-summary>
      </div>
        
      <!-- RIGHT SIDE -->
      
      <div class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2">
      <div class="grid grid-cols-3 gap-3 h-12 mb-3">
            <button class="btn-primary rounded" :class="{ 'active' : tab == 'drivers' }" @click="setTab('drivers')">Additional Drivers</button>
            <button class="btn-primary rounded" :class="{ 'active' : tab == 'extras' }" @click="setTab('extras')">Optional Extras</button>
            <button class="btn-primary rounded" :class="{ 'active' : tab == 'uploads' }" @click="setTab('uploads')">Upload Documents</button>
          </div>
        <div class="flex flex-col shadow-xl bg-white p-5 gap-2 py-10 mb-5">          
          <section-drivers v-show="tab == 'drivers'" :bookingdata="bookingdata" @update="$emit('update')" :customer="customer"></section-drivers>
          <section-extras v-show="tab == 'extras'" :bookingdata="bookingdata" :insuranceid="insuranceid" :optionalfees="optionalfees" :mandatoryfees="mandatoryfees" @insurance-changed="updateIns"></section-extras>
          <section-uploads v-show="tab == 'uploads'"></section-uploads>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  import LoadingOverlay from '../components/LoadingOverlay.vue'
  import SectionExtras from '../components/SectionExtras.vue'
  import SectionUploads from '../components/SectionUploads.vue'
  import SectionSummary from '../components/SectionSummary.vue'
  import SectionDrivers from '../components/SectionDrivers.vue'
  export default {
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      customer: Object,
    },
    components: {
      SectionSummary,
      SectionDrivers,
      SectionUploads,
      SectionExtras,
      LoadingOverlay
    },
    data() {
      return {
        tab: "drivers",
        totals: [],
        loading: true,
        insuranceid: 0,
        optionalfees: [],
        mandatoryfees: [],
      }
    },
    watch: {
      bookingdata: {
        handler(){
          this.calcTotal()
        },
        deep: true
      },
      insuranceid: {
        handler() {
          this.calcTotal()
        }
      }
    },
    mounted() {
      this.init()
      this.calcTotal()
    },
    methods: {
      init() {
        let data = this.bookingdata.extrafees
        this.insuranceid = this.getIns(data)
        this.mandatoryfees = this.getMans(data)
        this.optionalfees = this.getOpts(data)
      },
      updateIns(event) {
        console.log(event)
        this.insuranceid = event
      },
      getIns(data) {
        let id
        data.forEach(el => {
          if (el.isinsurancefee) {
            id = el.extrafeeid
          }
        })
        return id
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
      getFees(data) {
        let fees = []
        data.forEach(el => {
          // if ()
        })
      },
      setTab(str) {
        if (this.tab == str) {
          this.tab = ""
        } else {
          this.tab = str
        }
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
          "insuranceid": this.insuranceid,
          "extrakmsid": this.bookingdata.bookinginfo[0].kmcharges_id,
          "mandatoryfees": this.mandatoryfees,
          "optionalfees": this.optionalfees,
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        })
        console.log(JSON.parse(method))
        Mixins.methods.postapiCall(method)
        .then(res => JSON.parse(res))
        .then(res => {
          this.loading = false
          if (res.status == 'OK') {
            console.log(res.results.totals)
            this.totals = res.results.totals
          } else if (res.status == 'ERR') {
            throw res.error
          }
        })
      }
    }
  }
</script>

<style lang="postcss" scoped>
@layer components {
  .active {
      @apply from-blue-800 to-blue-900 ring-2 ring-blue-200
    }
}
</style>