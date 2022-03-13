<template>
  <div class="flex flex-col md:flex-row gap-3 items-start">
    <!-- LEFT SIDE -->
    <div class="w-full md:w-2/6 order-2 md:order-1 px-1">
      <booking-summary
        v-if="bookingdata && bookingdata.bookinginfo"
        :resref="resref"
        :totals="totals"
        :bookingdata="bookingdata"
      ></booking-summary>
    </div>
    <!-- RIGHT SIDE -->
    <div
      v-if="bookingdata && bookingdata.bookinginfo"
      class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2 gap-4"
    >
      <!-- TIP INFO -->
      <div class="flex flex-col relative p-2 md:p-5 bg-white rounded">
        <p class="text-xl font-bold text-left">Trip Details</p>
        <modify-trip
          :loading="savingChanges"
          :bookingdata="bookingdata"
          :customer="customer"
          @save-changes="editBooking($event, customer)"
        ></modify-trip>
      </div>

      <!-- CUSTOMER INFO -->
      <div class="flex flex-col relative p-2 md:p-5 bg-white rounded">
        <p class="text-xl font-bold text-left">Customer Details</p>
        <modify-driver
          :loading="savingChanges"
          :bookingdata="bookingdata"
          :customer="customer"
          :countries="countries"
          :is-primary="true"
          @save-changes="editBooking(bookingdata, $event)"
        ></modify-driver>
      </div>

      <!-- ADDTIONAL DRIVERS -->
      <div
        v-show="extradrivers && extradrivers.length"
        class="flex flex-col relative p-2 md:p-5 bg-white rounded"
      >
        <p class="text-xl font-bold text-left mt-2">Additional Drivers</p>
        <modify-driver
          v-for="driver in extradrivers"
          :key="driver.customerid"
          :customer="driver"
          :countries="countries"
          @update="$emit('update')"
        ></modify-driver>
      </div>

      <!-- NEW DRIVER -->
      <div
        v-if="!isQuotation && extradrivers && extradrivers.length < 4"
        class="flex flex-col relative p-2 md:p-5 bg-white rounded"
      >
        <button
          v-if="extradrivers && extradrivers.length < 4"
          :class="{ 'bg-green-500 text-white': showNewDriver }"
          class="btn-green my-2"
          @click="showNewDriver = !showNewDriver"
        >
          <i class="fas fa-plus-circle"></i> Add a Driver
        </button>

        <p v-if="showNewDriver" class="text-xl font-bold text-left">
          New Driver Details
        </p>
        <modify-driver
          v-if="showNewDriver && extradrivers.length < 4"
          :countries="countries"
          :new-driver="true"
          @update="updateExtraDriver()"
        ></modify-driver>
      </div>
    </div>
  </div>
</template>

<script>
import ModifyTrip from '@/components/postbooking/ModifyTrip.vue'
import BookingSummary from '@/components/postbooking/BookingSummary.vue'
import ModifyDriver from '@/components/postbooking/ModifyDriver.vue'
import Mixins from '@/Mixins'
export default {
  components: {
    ModifyDriver,
    ModifyTrip,
    BookingSummary,
  },

  mixins: [Mixins],

  props: {
    bookingdata: Object,
    customer: Object,
    extradrivers: Array,
    totals: Array,
    resref: String,
  },
  emits: ['update'],
  data() {
    return {
      countries: [],
      showNewDriver: false,
      savingChanges: false,
    }
  },
  computed: {
    isQuotation() {
      return this.bookingdata.bookinginfo[0].isquotation
    },
  },
  created() {
    this.getCountries()
  },
  mounted() {},
  methods: {
    getCountries() {
      let method = {
        method: 'countries',
      }
      Mixins.methods.postapiCall(method).then((results) => {
        this.countries = results.results
      })
    },
    updateExtraDriver() {
      this.$emit('update')
      this.showNewDriver = false
    },
    defaultCustomer() {
      return {
        customerid: 0,
        firstname: '',
        lastname: '',
        dateofbirth: '01/01/2000',
        email: '',
        phone: '',
        mobile: '',
        address: '',
        city: '',
        state: '',
        postcode: '',
        countryid: 7,
        country: 'Australia',
        licenseno: '',
        licenseexpires: '',
        licenseissued: 'Australia',
      }
    },
    editBooking(data, customer) {
      this.savingChanges = true
      let bookingtype = data.bookinginfo[0].isquotation ? 1 : 2
      let insuranceid = null
      let optionalfees = []
      data.extrafees.forEach((el) => {
        if (el.isinsurancefee) {
          insuranceid = el.extrafeeid
        }
        if (el.isoptionalfee) {
          optionalfees.push({
            id: el.extrafeeid,
            qty: el.qty,
          })
        }
      })
      let method = {
        method: 'editbooking',
        reservationref: data.bookinginfo[0].reservationref,
        flightin: data.bookinginfo[0].flightin,
        flightout: data.bookinginfo[0].flightout,
        arrivalpoint: data.bookinginfo[0].arrivalpoint,
        departurepoint: data.bookinginfo[0].departurepoint,
        remark: data.bookinginfo[0].remark,
        bookingtype: bookingtype,
        insuranceid: insuranceid,
        optionalfees: optionalfees,
        extrakmsid: data.bookinginfo[0].kmcharges_id,
        numbertravelling: data.bookinginfo[0].numbertravelling,
        customer: {
          ...customer,
        },
      }
      Mixins.methods.postapiCall(method).then((res) => {
        console.log(res)
        this.savingChanges = false
        this.$emit('update')
      })
    },
  },
}
</script>
