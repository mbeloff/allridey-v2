<template>
  <div class="flex flex-col md:flex-row gap-3 items-start">
    <!-- LEFT SIDE -->
    <div class="w-full md:w-2/6 order-2 md:order-1 px-1">
      <section-summary v-if="bookingdata && bookingdata.bookinginfo" :resref="resref" :totals="totals" :bookingdata="bookingdata"></section-summary>
    </div>
    <!-- RIGHT SIDE -->
    <div class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2    gap-4" v-if="bookingdata && bookingdata.bookinginfo">
      <!-- TIP INFO -->
      <div class="flex flex-col relative p-2 md:p-5 bg-white rounded">
        <p class="text-xl font-bold text-left">Trip Details</p>
        <modify-trip @save-changes="editBooking()" :loading="savingChanges" :bookingdata="bookingdata" :customer="customer"></modify-trip>
      </div>

      <!-- CUSTOMER INFO -->
      <div class="flex flex-col relative p-2 md:p-5 bg-white rounded">
        <p class="text-xl font-bold text-left">Customer Details</p>
        <modify-driver @save-changes="editBooking()" :loading="savingChanges" :bookingdata="bookingdata" :customer="customer" :countries="countries" :isPrimary="true"></modify-driver>
      </div>

      <!-- ADDTIONAL DRIVERS -->
      <div class="flex flex-col relative p-2 md:p-5 bg-white rounded" v-show="extradrivers && extradrivers.length">        
        <p class="text-xl font-bold text-left mt-2" >Additional Drivers</p>
        <modify-driver @update="$emit('update')" v-for="customer in extradrivers" :customer="customer" :countries="countries"></modify-driver>
      </div>

        <!-- NEW DRIVER -->
      <div class="flex flex-col relative p-2 md:p-5 bg-white rounded" v-if="!isQuotation && extradrivers && extradrivers.length < 4"> 
        <button v-if="extradrivers && extradrivers.length < 4" :class="{ 'bg-green-500 text-white' : newDriver }" class="btn-green my-2" @click="newDriver = !newDriver"><i class="fas fa-plus-circle"></i> Add a Driver</button>

        <p v-if="newDriver" class="text-xl font-bold text-left">New Driver Details</p>
        <modify-driver @update="$emit('update'); newDriver = false" :countries="countries" v-if="newDriver && extradrivers.length < 4" :customer="defaultCustomer()" :newDriver="true"></modify-driver>
      </div>
    </div>
  </div>
</template>

<script>
  import ModifyTrip from '@/components/postbooking/ModifyTrip.vue'
  import SectionSummary from '@/components/postbooking/BookingSummary.vue'
  import ModifyDriver from '@/components/postbooking/ModifyDriver.vue'
  import Mixins from '@/Mixins'
  export default {
    components: {
      ModifyDriver,
      ModifyTrip,
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
        savingChanges: false,
      }
    },
    created() {
      this.getCountries()
    },
    mounted() {},
    computed: {
      isQuotation() {
        return this.bookingdata.bookinginfo[0].isquotation
      }
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
      },
      editBooking() {
        this.savingChanges = true
        let bookingtype = (this.bookingdata.bookinginfo[0].isquotation) ? 1 : 2;
        let insuranceid = null
        let optionalfees = []
        this.bookingdata.extrafees.forEach(el => {
          if (el.isinsurancefee) {
            insuranceid = el.extrafeeid
          }
          if (el.isoptionalfee) {
            optionalfees.push({
              id: el.extrafeeid,
              qty: el.qty
            })
          }
        })
        let method = JSON.stringify({
          "method": "editbooking",
          "reservationref": this.bookingdata.bookinginfo[0].reservationref,
          "flightin": this.bookingdata.bookinginfo[0].flightin,
          "flightout": this.bookingdata.bookinginfo[0].flightout,
          "arrivalpoint": this.bookingdata.bookinginfo[0].arrivalpoint,
          "departurepoint": this.bookingdata.bookinginfo[0].departurepoint,
          "remark": this.bookingdata.bookinginfo[0].remark,
          "bookingtype": bookingtype,
          "insuranceid": insuranceid,
          "optionalfees": optionalfees,
          "extrakmsid": this.bookingdata.bookinginfo[0].kmcharges_id,
          "numbertravelling": this.bookingdata.bookinginfo[0].numbertravelling,
          "customer": {
            ...this.customer
          }
        })
        Mixins.methods.postapiCall(method)
        .then(res => {
          console.log(res)
          this.savingChanges = false
          this.$emit("update")
        })
      }
    }
  }
</script>