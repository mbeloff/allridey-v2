<template>
  <div>
    <div class="grid grid-flow-col place-items-center gap-2 mt-10">
      <button @click="setMode(1), scroll('scrollMarker')" class="btn btn-secondary ml-auto">Email Quote</button>
      <button @click="setMode(2), scroll('scrollMarker')" class="btn btn-secondary mr-auto">Make Booking</button>
    </div>
    <transition name="slide-down">
      <div ref="scrollMarker" v-if="mode" class="relative grid place-items-center my-5 text-blue-600">
      <i class="fas fa-chevron-down"></i>
      <transition name="slide-down">
        <i class="fas fa-chevron-down absolute -top-1.5"></i>
      </transition>     
    </div>
    </transition>
    
    <form ref="bookingform" action="javascript:void(0)" @submit="submitBooking">
      <form-customer  :parameters="parameters" :mode="mode" v-if="mode && parameters"></form-customer>
      <div v-if="mode" class="bg-white rounded my-5 p-2 px-4 shadow-xl flex items-center w-full md:w-max"  :class="{ 'border border-blue-700' : showOptional }">
        <input type="checkbox" name="showops" id="showops" class="mr-2 hidden" v-model="showOptional">
        <label ref="showops" for="showops" class="text-left text-sm font-bold text-blue-800 flex items-center" @click="scroll('showops')">
          <i class="fal fa-check-circle fa-2x mr-2 text-gray-300" :class="{ 'text-blue-800' : showOptional}"></i> 
          <span>Make pickup quick and easy by providing more details ahead of time?</span>
        </label>
      </div>
      <div ref="container">
        <transition name="fade-fast">        
          <form-optional v-if="showOptional" :step3="step3" :parameters="parameters"></form-optional>  
        </transition>
      </div>      
      <button type="submit"  v-if="mode" class="btn btn-primary mt-5">{{ btnText }}</button>
    </form>
  </div>
</template>

<script>
 import smoothHeight from 'vue-smooth-height';
 import FormCustomer from './forms/FormCustomer.vue'
 import FormOptional from './forms/FormOptional.vue'
 import Mixins from '../Mixins'
 export default {
   mixins: [Mixins, smoothHeight],
   components: {
     FormCustomer,
     FormOptional
   },
   mounted() {
      this.updateBookingParameters()
      this.$smoothElement({
            el: this.$refs.container,
        })
      this.parameters.agentcode = this.$store.state.searchParams.agentcode
  },
   props: {
     optionalfees: Object,
     calcTotals: Object,
     searchParams: Object,
     step3: Object
    },
    watch: {},
    data() {
      return {
        mode: null,
        showOptional: false,
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
          optionalfees: [],
          agentcode: ''
        }
      }
    },
    methods: {
      scroll(ref) {
        setTimeout(()=>{ this.$refs[ref].scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})}, 100);        
      },
      submitBooking() {
        console.log('emitting submit with mode=' + this.mode)
        this.$store.dispatch("bookingparams", this.parameters)
        this.$emit('submit1')
      },
      setMode(mode) {
        this.mode = mode
        this.$emit('modeChange', mode)
      },
      updateBookingParameters() {
        this.parameters.vehiclecategorytypeid = this.searchParams.vehiclecategorytypeid
        this.parameters.vehiclecategoryid = this.calcTotals.vehiclecategoryid
        this.parameters.pickuplocationid = this.searchParams.pickuplocationid
        this.parameters.pickuptime = this.searchParams.pickuptime
        this.parameters.pickupdate = this.searchParams.pickupdate
        this.parameters.dropofflocationid = this.searchParams.dropofflocationid
        this.parameters.dropofftime = this.searchParams.dropofftime
        this.parameters.dropoffdate = this.searchParams.dropoffdate
        this.parameters.ageid = this.searchParams.ageid
        this.parameters.insuranceid = this.calcTotals.insuranceid
        this.parameters.extrakmsid = this.calcTotals.extrakmsid
        this.parameters.optionalfees = this.calcTotals.optionalfees
      }
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
  transition: transform 2s ease, opacity 0.35s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0
}

.fade-fast-enter-active, .fade-fast-leave-active {
    transition: opacity .5s;
}
.fade-fast-enter-from, .fade-fast-leave-to {
    opacity: 0;
}
</style>