<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1 text-left bg-white border p-2 rounded mt-2 relative"
  >
    <loading-overlay v-if="loading"></loading-overlay>
    <div class="flex flex-col flex-grow group">
      <label for="fName" class="text-xs mb-1 my-label">First Name</label>
      <input
        id="fName"
        v-model="customerdata.firstname"
        maxlength="30"
        required
        type="text"
        class="my-input"
        :disabled="isPrimary"
        :class="{ 'text-gray-400': isPrimary }"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="lName" class="text-xs mb-1 my-label">Last Name</label>
      <input
        id="lName"
        v-model="customerdata.lastname"
        maxlength="40"
        required
        type="text"
        class="my-input"
        :disabled="isPrimary"
        :class="{ 'text-gray-400': isPrimary }"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="email" class="text-xs mb-1 my-label">Email</label>
      <input
        id="email"
        v-model="customerdata.email"
        maxlength="50"
        required
        type="email"
        class="my-input"
        :disabled="isPrimary"
        :class="{ 'text-gray-400': isPrimary }"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="phone" class="text-xs mb-1 my-label">Phone</label>
      <input
        id="phone"
        v-model="customerdata.mobile"
        maxlength="25"
        required
        type="tel"
        class="my-input"
      />
    </div>

    <date-picker
      v-model="dateofbirth"
      :max-date="new Date()"
      :update-on-input="false"
      class="flex flex-col flex-grow group"
    >
      <template #default="{ inputValue, inputEvents }">
        <label for="" class="my-label">Date of Birth</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-calendar fa-fw"></i>
          <input class="my-input w-8" :value="inputValue" v-on="inputEvents" />
        </div>
      </template>
    </date-picker>

    <div class="flex flex-col flex-grow group">
      <label for="licenseno" class="text-xs my-label">License #</label>
      <input
        id="licenseno"
        v-model="customerdata.licenseno"
        maxlength="70"
        type="text"
        class="my-input"
      />
    </div>

    <date-picker
      v-model="licenseexpires"
      :min-date="new Date()"
      :update-on-input="false"
      class="flex flex-col flex-grow group"
    >
      <template #default="{ inputValue, inputEvents }">
        <label for="" class="my-label">License Expiry</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 form-i fal fa-calendar fa-fw"></i>
          <input class="my-input w-8" :value="inputValue" v-on="inputEvents" />
        </div>
      </template>
    </date-picker>
    <div class="flex flex-col flex-grow group">
      <label for="licenseissued" class="text-xs my-label"
        >License Issued In</label
      >
      <select
        id="licenseissued"
        v-model="customerdata.licenseissued"
        class="my-input"
      >
        <option
          v-for="country in countries"
          :key="country.id"
          :value="country.country"
        >
          {{ country.country }}
        </option>
      </select>
    </div>

    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">Street Address</label>
      <input
        id="address"
        v-model="customerdata.address"
        maxlength="80"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">City</label>
      <input
        id="city"
        v-model="customerdata.city"
        maxlength="50"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col group">
      <label for="state" class="my-label">State</label>
      <input
        id="state"
        v-model="customerdata.state"
        maxlength="30"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col group">
      <label for="country" class="my-label">Country</label>
      <select id="country" v-model="customerdata.countryid" class="my-input">
        <option
          v-for="country in countries"
          :key="country.id"
          :value="country.id"
        >
          {{ country.country }}
        </option>
      </select>
    </div>
    <div class="flex flex-col flex-grow group mb-4 md:mb-0">
      <label for="postcode" class="my-label">Postcode</label>
      <input
        id="postcode"
        v-model="customerdata.postcode"
        maxlength="10"
        type="text"
        class="my-input"
      />
    </div>

    <div class="grid grid-cols-2 gap-3 h-8 mt-auto">
      <button
        v-if="!newDriver && !isPrimary"
        class="btn-red"
        @click="extraDriver(-customerdata.customerid)"
      >
        Delete <i class="far fa-times"></i>
      </button>
      <button
        v-if="!isPrimary"
        class="btn-green col-start-2"
        @click="extraDriver(customerdata.customerid)"
      >
        {{ !newDriver ? 'Update' : 'Add' }} <i class="far fa-cloud-upload"></i>
      </button>
      <button
        v-if="isPrimary"
        class="btn-green col-start-2"
        @click="$emit('save-changes')"
      >
        Update <i class="far fa-cloud-upload"></i>
      </button>
    </div>
  </div>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import Mixins from '@/Mixins'
export default {
  components: {
    LoadingOverlay,
  },
  mixins: [Mixins],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    bookingdata: Object,
    newDriver: {
      type: Boolean,
      default: false,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    customer: {
      type: Object,
      default() {
        return {
          customerid: 0,
          firstname: '',
          lastname: '',
          dateofbirth: '',
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
    },
    countries: Array,
  },
  emits: ['save-changes', 'update'],
  data() {
    return {
      customerdata: {},
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
        ['Dec', '12'],
      ],
    }
  },
  watch: {
    dateofbirth: function () {
      this.customerdata.dateofbirth =
        this.dateofbirth.toLocaleDateString('en-AU')
    },
    licenseexpires: function () {
      this.customerdata.licenseexpires =
        this.licenseexpires.toLocaleDateString('en-AU')
    },
  },
  mounted() {
    this.customerdata = this.customer
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
      list.forEach((el) => {
        newStr = newStr.replaceAll(el[0], el[1])
      })
      return newStr
    },
    extraDriver(id) {
      let method = {
        method: 'extradriver',
        reservationref: this.$store.state.pbresref,
        customerid: id,
        customer: {
          ...this.customerdata,
        },
      }
      Mixins.methods
        .postapiCall(method)
        .then(this.$emit('update'))
        .catch((err) => console.log(err))
    },
  },
}
</script>

<style scoped>
.my-input {
  padding: 0.25rem;
}
</style>
