<template>
  <div>
    <div class="grid grid-flow-col place-items-center gap-2 mt-10">
      <button @click="setMode(1)" class="btn btn-secondary ml-auto">Email Quote</button>
      <button @click="setMode(2)" class="btn btn-secondary mr-auto">Make Booking</button>
    </div>
    <transition name="slide-down">
      <div v-if="mode" class="relative grid place-items-center my-5 text-blue-600">
      <i class="fas fa-chevron-down"></i>
      <transition name="slide-down">
        <i class="fas fa-chevron-down absolute -top-1.5"></i>
      </transition>
      
    </div>
    </transition>
    
    <form action="javascript:void(0)" @submit="submitBooking">
      <form-customer  :parameters="parameters" :mode="mode" v-if="mode && parameters"></form-customer>
      <form-optional :step3="step3" :parameters="parameters" v-show="mode == 2"></form-optional>
      <button type="submit"  v-if="mode" class="btn btn-primary mt-5">{{ btnText }}</button>
    </form>
  </div>
</template>

<script>
 import FormCustomer from './FormCustomer.vue'
 import FormOptional from './FormOptional.vue'
 import Mixins from '../Mixins'
 export default {
   mixins: [Mixins],
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
          // ! email option 0 = off, 1 = default, 2 = always send
          emailoption: 0,
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
      submitBooking() {
        console.log('emitting submit with mode=' + this.mode)
        this.$store.dispatch("bookingparams", this.parameters)
        // this.makeBooking(this.parameters)
        this.$emit('submit1')
      },
      setMode(mode) {
        this.mode = mode
        this.$emit('modeChange', mode)
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
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 1s ease, opacity 0.35s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0
}
</style>