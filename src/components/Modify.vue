<template>
  <div class="py-10 container max-w-screen-lg mx-auto px-0 md:px-5">
    <div class="flex flex-col md:flex-row gap-3 items-start">
      <!-- LEFT SIDE -->
      <div class="w-full md:w-2/6 order-2 md:order-1 px-1" >
        <div v-if="!totals.length" class="bg-white h-64 w-full rounded relative">
          <p class="text-3xl px-2 py-3">Booking Summary</p>
          <loading-overlay></loading-overlay>
        </div>
        <section-summary v-if="totals.length" :bookingdata="bookingdata" :totals="totals" :loading="loading"></section-summary>       
      </div>
      <!-- RIGHT SIDE -->

      <div class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2 px-1">
        <div class="grid grid-cols-3 gap-3 h-12 mb-3">
          <button class="btn-primary rounded" :class="{ 'active' : tab == 'drivers' }" @click="setTab('drivers')">Additional Drivers</button>
          <button class="btn-primary rounded" :class="{ 'active' : tab == 'extras' }" @click="setTab('extras')">Optional Extras</button>
          <button class="btn-primary rounded" :class="{ 'active' : tab == 'uploads' }" @click="setTab('uploads')">Upload Documents</button>
        </div>
        <div class="flex flex-col shadow-xl bg-white rounded p-2 md:p-5 gap-2 py-10 mb-5">
          <section-drivers v-show="tab == 'drivers'" :bookingdata="bookingdata" @update="$emit('update')" :customer="customer"></section-drivers>
          <section-extras v-show="tab == 'extras'" :bookingdata="bookingdata" :insuranceid="insuranceid" @insurance-changed="updateIns" @options-changed="updateOpts" @save-changes="editBooking"></section-extras>
          <section-uploads v-show="tab == 'uploads'" :bookingdata="bookingdata"></section-uploads>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  import LoadingOverlay from '../components/LoadingOverlay.vue'
  import SectionExtras from './ModifyExtras.vue'
  import SectionUploads from './ModifyUploads.vue'
  import SectionSummary from '../components/SectionSummary.vue'
  import SectionDrivers from './ModifyDrivers.vue'
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
        selectedoptions: [],
        mandatoryfees: [],
      }
    },
    watch: {
      tab: {
        handler(newVal) {
          if (newVal == 'drivers') {
            this.$emit('update')
          }
        }
      },
      bookingdata: {
        handler() {
          this.calcTotal()
        },
        deep: true
      },
      optionalfees: {
        handler() {
          let arr = this.optionalfees
          let sel = []
          if (arr.length > 0) {
            arr.forEach(el => {
              if (el.selected == true) {
                sel.push({
                  id: el.id,
                  qty: el.qty
                })
              }
            })
          }
          this.selectedoptions = sel
          this.calcTotal()
        },
        deep: true,
        immediate: true
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
      updateOpts(event) {
        this.optionalfees = event
      },
      updateIns(event) {
        this.insuranceid = event
        this.calcTotal()
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
      // getFees(data) {
      //   let fees = []
      //   data.forEach(el => {
      //     // if ()
      //   })
      // },
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
          "optionalfees": this.selectedoptions,
          "reservationref": this.bookingdata.bookinginfo[0].reservationref
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            this.loading = false
            if (res.status == 'OK') {
              this.totals = res.results.totals
            } else if (res.status == 'ERR') {
              throw res.error
            }
          })
      },
      editBooking() {
        let bookingtype = (this.bookingdata.bookinginfo[0].isquotation) ? 1 : 2;
        this.loading = true;
        let method = JSON.stringify({
          "method": "editbooking",
          "reservationref": this.bookingdata.bookinginfo[0].reservationref,
          "bookingtype": bookingtype,
          "insuranceid": this.insuranceid,
          "extrakmsid": this.bookingdata.bookinginfo[0].kmcharges_id,
          "numbertravelling": this.bookingdata.bookinginfo[0].numbertravelling,
          "customer": {
            ...this.customer[0]
          },
          "optionalfees": this.selectedoptions
        })
        Mixins.methods.postapiCall(method)
          .then(res => {
            this.loading = false
            if (res.status == 'OK') {
              this.calcTotal()
              this.$emit('update')
            } else if (res.status == 'ERR') {
              throw res.error
            }
          })
      },
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