<template>
  <div>
    <div class="grid grid-flow-col place-items-center gap-2 mt-10">
      <button @click="setMode(1)" class="bg-green-500 px-4 py-1 ml-auto">Email Quote</button>
      <button @click="setMode(2)" class="bg-green-500 px-4 py-1 mr-auto">Make Booking</button>
    </div>
    <form-customer :parameters="parameters" :mode="mode" v-if="mode && parameters"></form-customer>
    <form-optional :step3="step3" :parameters="parameters" v-if="mode == 2"></form-optional>
    <button v-if="mode" @click="submitBooking(mode)" class="bg-green-500  px-4 py-1 ml-auto mt-5">{{ btnText }}</button>
  </div>
</template>

<script>
  import FormCustomer from './FormCustomer.vue'
  import FormOptional from './FormOptional.vue'
  export default {
    components: {
      FormCustomer,
      FormOptional
    },
    props: {
      optionalfees: Object,
      calcTotals: Object,
      submittedParams: Object,
      step3: Object
    },
    watch: {},
    data() {
      return {
        mode: null,
        parameters: {
          method: "booking",
          vehiclecategorytypeid: 0,
          pickuplocationid: 0,
          pickupdate: "",
          pickuptime: "",
          dropofflocationid: 0,
          dropoffdate: "",
          dropofftime: "",
          ageid: 0,
          vehiclecategoryid: 0,
          bookingtype: 1,
          insuranceid: "",
          extrakmsid: "",
          transmission: 0,
          numbertravelling: "",
          customer: {
            firstname: "",
            lastname: "",
            dateofbirth: new Date().toLocaleDateString(),
            licenseno: "",
            licenseissued: 7, // Default country id (Australia)
            licenseexpires: "",
            email: "",
            phone: "",
            state: "",
            city: "",
            postcode: "",
            address: "",
            countryid: 7, // Default country id (Australia)
          },
          emailoption: 1,
          foundusid: 63,
          remark: "",
          areaofuseid: "",
          newsletter: true,
          refno: "",
          optionalfees: []
        }

      }
    },
    methods: {
      submitBooking(mode) {
        if (mode == 1) {
          this.$emit('submitQuote', this.parameters)
        } else if (mode == 2) {
          this.$emit('submitBooking', this.parameters)
        }        
      },
      setMode(mode) {
        this.mode = mode
        this.parameters.bookingtype = mode
      },
      updateBookingParameters() {
        this.parameters.vehiclecategorytypeid = this.submittedParams.vehiclecategorytypeid
        this.parameters.vehiclecategoryid = this.calcTotals.vehiclecategoryid
        this.parameters.pickuplocationid = this.submittedParams.pickuplocationid
        this.parameters.pickuptime = this.submittedParams.pickuptime
        this.parameters.pickupdate = this.submittedParams.pickupdate
        this.parameters.dropofflocationid = this.submittedParams.dropofflocationid
        this.parameters.dropofftime = this.submittedParams.dropofftime
        this.parameters.dropoffdate = this.submittedParams.dropoffdate
        this.parameters.ageid = this.submittedParams.ageid
        this.parameters.insuranceid = this.calcTotals.insuranceid
        this.parameters.extrakmsid = this.calcTotals.extrakmsid
        this.parameters.optionalfees = this.calcTotals.optionalfees

        // this.parameters = updated
      }
    },
    mounted() {
      this.updateBookingParameters()
    },
    computed: {
      btnText() {
        if (this.mode == 1) {
          return 'Get Quote'
        } else if (this.mode == 2) {
          return 'Book Now'
        }
      }
    }
  }
</script>

<style>

</style>