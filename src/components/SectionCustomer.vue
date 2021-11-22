<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1 text-left bg-white border p-2 rounded mt-2 relative">
    <loading-overlay v-if="loading"></loading-overlay>
    <div class="flex flex-col flex-grow group">
      <label for="fName" class="text-xs mb-1 my-label">First Name</label>
      <div class="flex flex-row place-items-center">
        <input required type="text" id="fName" class="my-input" v-model="customer.firstname">
      </div>
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="lName" class="text-xs mb-1 my-label">Last Name</label>
      <div class="flex flex-row place-items-center">
        <input required type="text" id="lName" class="my-input" v-model="customer.lastname">
      </div>
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="email" class="text-xs mb-1 my-label">Email</label>
      <div class="flex flex-row place-items-center">
        <input required type="email" id="email" class="my-input" v-model="customer.email">
      </div>
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="phone" class="text-xs mb-1 my-label">Phone</label>
      <div class="flex flex-row place-items-center">
        <input required type="tel" id="phone" class="my-input" v-model="customer.phone">
      </div>
    </div>

    <date-picker v-model="dateofbirth" :max-date="new Date()" :update-on-input="false" class="flex flex-col flex-grow group">
      <template v-slot="{ inputValue, inputEvents }">
        <label for="" class="my-label">Date of Birth</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-calendar fa-fw"></i>
          <input class="my-input" :value="inputValue" v-on="inputEvents"/>
        </div>
      </template>
    </date-picker>


    <div class="flex flex-col flex-grow group">
      <label for="licenseno" class="text-xs my-label">License #</label>
      <div class="flex flex-row place-items-center">
        <input type="text" id="licenseno" class="my-input" v-model="customer.licenseno">
      </div>
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="licenseissued" class="text-xs my-label">Country of Issue</label>
      <div class="flex flex-row place-items-center">
        <select id="licenseissued" class="my-input" v-model="customer.licenseissued">
          <option v-for="country in countries" :value="country.country">{{country.country}}</option>
        </select>
      </div>
    </div>
    <date-picker v-model="licenseexpires" :min-date="new Date()" :update-on-input="false" class="flex flex-col flex-grow group">
      <template v-slot="{ inputValue, inputEvents }">
        <label for="" class="my-label">License Expiry</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 form-i fal fa-calendar fa-fw"></i>
          <input class="my-input" :value="inputValue" v-on="inputEvents" />
        </div>
      </template>
    </date-picker>


    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">Street Address</label>
      <div class="flex flex-row place-items-center">
        <input type="text" id="address" class="my-input" v-model="customer.address">
      </div>
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">City</label>
      <div class="flex flex-row place-items-center">
        <input type="text" id="city" class="my-input" v-model="customer.city">
      </div>
    </div>
    <div class="flex flex-col group">
      <label for="state" class=" my-label">State</label>
      <div class="flex flex-row place-items-center">
        <input type="text" id="state" class="my-input" v-model="customer.state">
      </div>
    </div>
    <div class="flex flex-col group">
      <label for="country" class=" my-label">Country</label>
      <div class="flex flex-row place-items-center">
        <select id="country" class="my-input" v-model="customer.countryid">
          <option v-for="country in countries" :value="country.id">{{country.country}}</option>
        </select>
      </div>
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="postcode" class=" my-label">Postcode</label>
      <div class="flex flex-row place-items-center">
        <input type="text" id="postcode" class="my-input" v-model="customer.postcode">
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 h-8 mt-auto">
      <button v-if="!newDriver && !isPrimary" class="rounded bg-red-300" @click="extraDriver(-customer.customerid)">Delete</button>
      <button v-if="!isPrimary" class="rounded bg-green-300" @click="extraDriver(customer.customerid)">{{!newDriver ? 'Update' : 'Add'}}</button>
      <button v-if="isPrimary" class="rounded bg-green-300" @click="modifyCustomer()">Update</button>
    </div>

  </div>
</template>

<script>
import LoadingOverlay from '../components/LoadingOverlay.vue'
  import Mixins from '../Mixins'
  export default {
    components: {
      LoadingOverlay
    },
    mixins: [Mixins],
    props: {
      bookingdata: Object,
      newDriver: {
        type: Boolean,
        default: false,
      },
      isPrimary: {
        type: Boolean,
        default: false
      },
      customer: {
        type: Object,
        default: {
          "customerid": 0,
          "firstname": "",
          "lastname": "",
          "dateofbirth": "",
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
      countries: Array
    },
    data() {
      return {
        loading: false,
        dateofbirth: new Date(),
        licenseexpires: new Date(),
        months: [
          ['Jan', '01'],
          ['Feb', '02'],
          ['Mar', '03'],
          ['Apr', '04'],
          ['May', '05'],
          ['Jun', '06'],
          ['Jul', '07'],
          ['Aug', '08'],
          ['Sep', '09'],
          ['Oct', '10'],
          ['Nov', '11'],
          ['Dec', '12']
      ]
      }
    },
    watch: {
      'dateofbirth': function () {
        this.customer.dateofbirth = this.dateofbirth.toLocaleDateString()
      },
      'licenseexpires': function () {
        this.customer.licenseexpires = this.licenseexpires.toLocaleDateString()
      }
    },
    computed: {
    },
    mounted() {
      if (this.newDriver == false) {
        if (this.customer.dateofbirth) {
        let dob = this.replaceMonth(this.customer.dateofbirth) 
        dob = dob.split(' ')
        dob = new Date(dob[2], dob[1] - 1, dob[0])
        this.dateofbirth = dob
      } else {
        this.dateofbirth = new Date(2000, 0, 1)
      }
      if (this.customer.licenseexpires) {
        let exp = this.replaceMonth(this.customer.licenseexpires)
        exp = exp.split(' ')
        exp = new Date(exp[2], exp[1] - 1, exp[0])
        this.licenseexpires = exp
      } else {
        this.licenseexpires = new Date()
      }    
      } else {
        this.dateofbirth = new Date(2000, 0, 1)
        this.licenseexpires = new Date()     
      }         
    },
    methods: {
      replaceMonth(str) {
        let newStr = str.replaceAll('/', ' ')
        let list = this.months
        list.forEach(el => {
          newStr = newStr.replaceAll(el[0], el[1])
        })
        return newStr
      },
      extraDriver(id) {
        let method = JSON.stringify({
          method: "extradriver",
          reservationref: this.$store.state.pbresref,
          customerid: id,
          customer: {
            ...this.customer
          }
        })
        Mixins.methods.postapiCall(method).then(res => console.log(JSON.parse(res).results))
        this.$emit("update")
      },
      modifyCustomer() {
        this.loading = true
        let bookingtype = (this.bookingdata.bookinginfo[0].isquotation) ? 1 : 2;
        let insuranceid = null
        this.bookingdata.extrafees.forEach(el => {
          if (el.isinsurancefee) {
            insuranceid = el.extrafeeid
          }
        })
        let method = JSON.stringify({
          "method": "editbooking",
          "reservationref": this.bookingdata.bookinginfo[0].reservationref,
          "bookingtype": bookingtype,
          "insuranceid": insuranceid,
          "extrakmsid": this.bookingdata.bookinginfo[0].kmcharges_id,
          "numbertravelling": this.bookingdata.bookinginfo[0].numbertravelling,
          "customer": {
            ...this.customer
          }
        })
        Mixins.methods.postapiCall(method)
        .then(res => JSON.parse(res))
        .then(res => {
          console.log(res)
          this.loading = false
        })
        this.$emit("update")
      }
    },
  }
</script>

<style scoped>
  .my-input {
    padding: .25rem
  }
</style>