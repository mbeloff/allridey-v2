<template>
  <div class="flex flex-col md:flex-row gap-3 items-start">
    <!-- LEFT SIDE -->
    <div class="w-full md:w-2/6 order-2 md:order-1 px-1">
      <section-summary :resref="resref" :totals="totals" :bookingdata="bookingdata"></section-summary>
    </div>
    <!-- RIGHT SIDE -->
    <div class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2 p-2 md:p-5 bg-white rounded">
      <div class="flex flex-col relative">
        <!-- CUSTOMER INFO -->
        <p class="text-xl font-bold text-left">Customer Details</p>
        <section-customer :bookingdata="bookingdata" :customer="customer" :countries="countries" :isPrimary="true"></section-customer>
        <!-- ADDTIONAL DRIVERS -->
        <p class="text-xl font-bold text-left mt-2">Additional Drivers</p>
        <section-customer @update="$emit('update')" v-for="customer in extradrivers" :customer="customer" :countries="countries"></section-customer>
        <button v-if="extradrivers && extradrivers.length < 4" :class="{ 'bg-green-500 text-white' : newDriver }" class="btn-green my-2" @click="newDriver = !newDriver"><i class="fas fa-plus-circle"></i> Add a Driver</button>
        <!-- NEW DRIVER -->
        <p v-if="newDriver" class="text-xl font-bold text-left">New Driver Details</p>
        <section-customer @update="$emit('update'); newDriver = false" :countries="countries" v-if="newDriver && extradrivers.length < 4" :customer="defaultCustomer()" :newDriver="true"></section-customer>
      </div>
    </div>
  </div>
</template>

<script>
  import SectionSummary from './SectionSummary.vue'
  import SectionCustomer from './ModifyDriver.vue'
  import Mixins from '../Mixins'
  export default {
    components: {
      SectionCustomer,
      SectionSummary
    },
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      customer: Object,
      extradrivers: Array,
      totals: Array,
      resref: String
    },
    data() {
      return {
        countries: [],
        newDriver: false,
      }
    },
    created() {
      this.getCountries()
    },
    mounted() {
    },
    methods: {
      getCountries() {
        let method = JSON.stringify({
          "method": "countries"
        });
        Mixins.methods.postapiCall(method)
          .then(results => {
            this.countries = results.results
          })
      },
      defaultCustomer() {
        return {
          "customerid": 0,
          "firstname": "",
          "lastname": "",
          "dateofbirth": "01/01/2000",
          "email": "",
          "phone": "",
          "mobile": "",
          "address": "",
          "city": "",
          "state": "",
          "postcode": "",
          "countryid": 7,
          "country": "Australia",
          "licenseno": "",
          "licenseexpires": "",
          "licenseissued": "Australia"
        }
      }
    }
  }
</script>