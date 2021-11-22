<template>
  <div class="flex flex-col relative">
    <!-- CUSTOMER INFO -->
    <p class="text-xl font-bold text-left">Customer Details</p>
    <section-customer :bookingdata="bookingdata" :customer="bookingdata.customerinfo[0]" :countries="countries" :isPrimary="true"></section-customer>
    <!-- ADDTIONAL DRIVERS -->
    <p class="text-xl font-bold text-left mt-2">Additional Drivers</p>
    <section-customer @update="$emit('update')" v-for="customer in bookingdata.extradrivers" :customer="customer" :countries="countries"></section-customer>
    <button v-if="bookingdata.extradrivers.length < 4" :class="{ 'bg-green-500 text-green-700' : newDriver }" class="h-8 bg-green-300 rounded my-2" @click="newDriver = !newDriver">Add Driver</button>
    <!-- NEW DRIVER -->
    <section-customer @update="$emit('update'); newDriver = false" :countries="countries" v-if="newDriver && bookingdata.extradrivers.length < 4" :customer="defaultCustomer()" :newDriver="true"></section-customer>
  </div>
</template>

<script>
  import SectionCustomer from '../components/SectionCustomer.vue'
  import Mixins from '../Mixins'
  export default {
    components: {
      SectionCustomer
    },
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      customer: Object
    },
    data() {
      return {
        countries: [],
        newDriver: false,        
      }
    },
    beforeMount() {
      this.getCountries()
    },
    methods: {
      getCountries() {
        let method = JSON.stringify({
          "method": "countries"
        });
        Mixins.methods.postapiCall(method).then(results => {
          this.countries = JSON.parse(results).results
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