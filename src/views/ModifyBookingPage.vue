<template>
  <div class="bg-gray-300 h-full relative">
    <loading-overlay v-if="loading"></loading-overlay>
    <div class="py-10 container max-w-screen-lg mx-auto px-0 md:px-5">
      <div class="py-10">
        <div class="grid md:grid-flow-col gap-1 px-1">
          <label
            for="drivers"
            class="btn btn-primary"
            :class="{ active: tab == 'drivers' }"
            >Customer Details</label
          >
          <label
            for="extras"
            class="btn btn-primary"
            :class="{ active: tab == 'extras' }"
            >Upgrade Extras</label
          >
          <label
            v-if="isQuotation == false"
            for="uploads"
            class="btn btn-primary"
            :class="{ active: tab == 'uploads' }"
            >Upload Documents</label
          >
          <input
            id="drivers"
            v-model="tab"
            name="drivers"
            type="radio"
            value="drivers"
            hidden
          />
          <input
            id="extras"
            v-model="tab"
            name="extras"
            type="radio"
            value="extras"
            hidden
          />
          <input
            id="uploads"
            v-model="tab"
            name="uploads"
            type="radio"
            value="uploads"
            hidden
          />
        </div>
      </div>

      <modify-drivers
        v-if="tab == 'drivers'"
        :bookingdata="bookingdata"
        :customer="customer"
        :resref="resref"
        :totals="totals"
        :extradrivers="bookingdata.extradrivers"
        @update="bookingInfo()"
      ></modify-drivers>
      <modify-extras
        v-if="tab == 'extras'"
        :customer="customer"
        :initialtotals="totals"
        :bookingdata="bookingdata"
        :resref="resref"
        :insuranceid="insurancefee"
        @update="bookingInfo()"
      ></modify-extras>
      <modify-uploads
        v-if="tab == 'uploads'"
        :resref="resref"
        :totals="totals"
        :bookingdata="bookingdata"
        @update="bookingInfo()"
      ></modify-uploads>
    </div>
  </div>
</template>

<script>
import Mixins from '@/Mixins.js'
import ModifyDrivers from '@/components/postbooking/ModifyDrivers.vue'
import ModifyExtras from '@/components/postbooking/ModifyExtras.vue'
import ModifyUploads from '@/components/postbooking/ModifyUploads.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
export default {
  components: {
    ModifyUploads,
    ModifyExtras,
    LoadingOverlay,
    ModifyDrivers,
  },
  mixins: [Mixins],
  data() {
    return {
      bookingdata: {},
      loading: false,
      tab: 'drivers',
      totals: [],
      insurancefee: '',
      mandatoryfees: [],
      optionalfees: [],
      resref: '',
      customer: {},
      ready: false,
      isQuotation: null,
    }
  },
  created() {
    this.bookingInfo()
    this.resref = this.$store.state.pbresref
  },
  methods: {
    invalidBooking(resinfo) {
      // check status of reservation
      if (
        resinfo.bookinginfo[0].reservationstatus ==
        ('Cancelled' || 'Hired' || 'Non Revenue' || 'Returned')
      )
        return true

      // check if quote has expired (created more than 3 days ago)
      let datecreated_date = new Date(
        resinfo.bookinginfo[0].reservationcreateddate
      )
      let today = new Date()
      let diff = today.getTime() - datecreated_date.getTime()
      let diffDays = Math.ceil(diff / (1000 * 3600 * 24))
      if (this.isQuotation && diffDays > 3) return true

      return false
    },
    bookingInfo() {
      let resref = this.$store.state.pbresref
      this.loading = true
      this.ready = false
      let params = {
        method: 'bookinginfo',
        reservationref: resref,
      }
      Mixins.methods
        .postapiCall(params)
        .then((response) => {
          if (response.status == 'OK') {
            if (this.invalidBooking(response.results)) {
              this.$router.push({ name: 'Checkin', query: { valid: false } })
            }
            this.loading = false
            this.init(response.results)
          } else if (response.status == 'ERR') {
            console.log(response.error)
            this.$router.push({
              name: 'Checkin',
            })
          }
          if (response.Message) {
            console.log(response.Message)
            this.$router.push({
              name: 'Checkin',
            })
          }
          this.loading = false
        })
        .catch((err) => {
          console.log("could't get booking info: " + err)
          this.$router.push({
            name: 'Checkin',
          })
        })
    },
    getIns(data) {
      let id = data.find((el) => el.isinsurancefee)
      if (id) {
        return id.extrafeeid
      }
      return null
    },
    init(data) {
      let feedata = data.extrafees
      this.bookingdata = data
      this.customer = data.customerinfo[0]
      this.isQuotation = data.bookinginfo[0].isquotation
      this.insurancefee = this.getIns(feedata)
      this.mandatoryfees = this.getMans(feedata)
      this.optionalfees = this.getOpts(feedata)
      this.calcTotal()
    },
    getMans(data) {
      let fees = []
      data.forEach((el) => {
        if (el.isoptionalfee == false) {
          fees.push({
            id: el.extrafeeid,
            qty: el.qty,
          })
        }
      })
      return fees
    },
    getOpts(data) {
      let fees = []
      data.forEach((el) => {
        if (el.isoptionalfee == true && el.isinsurancefee == false) {
          fees.push({
            id: el.extrafeeid,
            qty: el.qty,
          })
        }
      })
      return fees
    },
    calcTotal() {
      this.loading = true
      let method = {
        method: 'calctotal',
        pickuplocationid: this.bookingdata.bookinginfo[0].pickuplocationid,
        pickupdate: this.bookingdata.bookinginfo[0].pickupdate,
        vehiclecategoryid: this.bookingdata.bookinginfo[0].vehiclecategoryid,
        numberofdays: this.bookingdata.bookinginfo[0].numberofdays,
        totalrateafterdiscount: this.bookingdata.rateinfo[0].ratesubtotal,
        freedaysamount: 0,
        insuranceid: this.insurancefee,
        extrakmsid: this.bookingdata.bookinginfo[0].kmcharges_id,
        mandatoryfees: this.mandatoryfees,
        optionalfees: this.optionalfees,
        reservationref: this.bookingdata.bookinginfo[0].reservationref,
      }
      Mixins.methods
        .postapiCall(method)
        .then((res) => {
          this.loading = false
          if (res.status == 'OK') {
            this.totals = res.results.totals
            this.ready = true
          } else if (res.status == 'ERR') {
            throw res.error
          }
        })
        .catch((err) => {
          console.log(err)
          this.$router.push({ name: 'Checkin', query: { valid: false } })
        })
    },
  },
}
</script>

<style lang="postcss">
.active {
  @apply from-blue-800 to-blue-900 shadow-blue-800/30;
}
</style>
