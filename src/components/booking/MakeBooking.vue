<template>
  <div>
    <div class="grid grid-flow-col place-items-center gap-2 mt-10">
      <button
        class="btn btn-secondary ml-auto"
        :class="{ 'bg-blue-600 text-white': mode == 1 }"
        @click="setMode(1), scroll('scrollMarker')"
      >
        Email Quote
      </button>
      <button
        class="btn btn-secondary mr-auto"
        :class="{ 'bg-blue-600 text-white': mode == 2 }"
        @click="setMode(2), scroll('scrollMarker')"
      >
        {{ available == 1 ? 'Book Now' : 'Request Now' }}
      </button>
    </div>
    <transition name="slide-down">
      <div
        v-if="mode"
        ref="scrollMarker"
        class="relative grid place-items-center my-5 text-blue-600"
      >
        <i class="fal fa-chevron-down" />
        <transition name="slide-down">
          <i class="fal fa-chevron-down absolute -top-1.5" />
        </transition>
      </div>
    </transition>
    <form
      ref="bookingform"
      action="javascript:void(0)"
      @submit="submitBooking()"
    >
      <form-customer
        v-if="mode && parameters"
        :parameters="parameters"
        :mode="mode"
      />
      <div
        v-if="mode"
        class="bg-white rounded my-5 p-2 px-4 shadow-xl flex items-center w-full md:w-max"
        :class="{ 'border border-blue-700': showOptional }"
      >
        <input
          id="showOptions"
          v-model="showOptional"
          type="checkbox"
          name="showOptions"
          class="mr-2 hidden"
        />
        <label
          ref="showOptions"
          for="showOptions"
          class="text-left text-sm font-bold text-blue-800 flex items-center"
          @click="scroll('showOptions')"
        >
          <i
            class="fal fa-check-circle fa-2x mr-2"
            :class="{
              'text-blue-800': showOptional,
              'text-gray-300': !showOptional,
            }"
          />
          <span
            >Make pickup quick and easy by providing more details ahead of
            time?</span
          >
        </label>
      </div>
      <div ref="container">
        <transition name="fade-fast">
          <form-optional
            v-if="showOptional"
            :step3="step3"
            :parameters="parameters"
            :foundus="foundus"
            :shuttle="shuttle"
          />
        </transition>
      </div>
      <button
        v-if="mode"
        class="btn btn-primary mt-5 relative"
        :disabled="pleaseWait"
        @click="$refs.bookingform.submit()"
      >
        Submit <loading-overlay v-if="pleaseWait" class="text-black" />
      </button>
    </form>
  </div>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import smoothHeight from 'vue-smooth-height'
import FormCustomer from '@/components/forms/FormCustomer.vue'
import FormOptional from '@/components/forms/FormOptional.vue'
import Mixins from '@/Mixins'
export default {
  components: {
    FormCustomer,
    FormOptional,
    LoadingOverlay,
  },
  mixins: [Mixins, smoothHeight],
  props: {
    optionalfees: Object,
    totalsParams: Object,
    searchParams: Object,
    step3: Object,
    shuttle: Boolean
  },
  emits: ['modeChange', 'create-booking'],
  data() {
    return {
      pleaseWait: false,
      mode: null,
      showOptional: false,
      parameters: {
        method: 'booking',
        vehiclecategorytypeid: '',
        pickuplocationid: '',
        pickupdate: '',
        pickuptime: '',
        dropofflocationid: '',
        dropoffdate: '',
        dropofftime: '',
        flightin: '',
        flightout: '',
        arrivalpoint: '',
        departurepoint: '',
        ageid: '',
        vehiclecategoryid: '',
        bookingtype: 1,
        insuranceid: '',
        extrakmsid: '',
        transmission: 0,
        numbertravelling: '',
        customer: {
          firstname: '',
          lastname: '',
          dateofbirth: '01/01/1990',
          licenseno: '',
          licenseissued: 7, // Default country id (Australia)
          licenseexpires: '',
          email: '',
          mobile: '',
          phone: '',
          state: '',
          city: '',
          postcode: '',
          address: '',
          countryid: 7, // Default country id (Australia)
        },
        emailoption: 0,
        foundusid: 2,
        remark: '',
        areaofuseid: '',
        newsletter: true,
        refno: '',
        optionalfees: [],
        agentcode: '',
      },
    }
  },
  computed: {
    foundus() {
      return this.step3.rentalsource
    },
    available() {
      return this.step3.availablecars[0].available
    },
  },
  watch: {},
  mounted() {
    this.initParams()
    this.$smoothElement({
      el: this.$refs.container,
    })
    this.parameters.agentcode = this.$store.state.searchParams.agentcode
    this.pleaseWait = false
  },

  methods: {
    scroll(ref) {
      setTimeout(() => {
        this.$refs[ref].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        })
      }, 100)
    },
    submitBooking() {
      this.pleaseWait = true
      Mixins.methods.apiCall(JSON.stringify(this.parameters)).then((data) => {
        this.$store.dispatch('resinfo', data)
        this.$emit('create-booking')
      })
    },
    setMode(mode) {
      this.mode = mode
      this.$emit('modeChange', mode)
    },
    initParams() {
      this.parameters.vehiclecategorytypeid =
        this.searchParams.vehiclecategorytypeid
      this.parameters.vehiclecategoryid = this.totalsParams.vehiclecategoryid
      this.parameters.pickuplocationid = this.searchParams.pickuplocationid
      this.parameters.pickuptime = this.searchParams.pickuptime
      this.parameters.pickupdate = this.searchParams.pickupdate
      this.parameters.dropofflocationid = this.searchParams.dropofflocationid
      this.parameters.dropofftime = this.searchParams.dropofftime
      this.parameters.dropoffdate = this.searchParams.dropoffdate
      this.parameters.ageid = this.searchParams.ageid
      this.parameters.insuranceid = this.totalsParams.insuranceid
      this.parameters.extrakmsid = this.totalsParams.extrakmsid
      this.parameters.optionalfees = this.totalsParams.optionalfees
    },
  },
}
</script>

<style lang="postcss">
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 2s ease, opacity 0.35s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.5s;
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}
</style>
