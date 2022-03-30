<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1 text-left bg-white border p-2 rounded mt-2 relative"
  >
    <loading-overlay v-if="loading"></loading-overlay>
    <div class="flex flex-col flex-grow group">
      <label :for="'fName' + cid" class="text-xs mb-1 my-label"
        >First Name</label
      >
      <input
        :id="'fName' + cid"
        v-model="customerdata.firstname"
        maxlength="30"
        required
        type="text"
        class="my-input"
        :disabled="isPrimary"
        :class="{ 'text-gray-400': isPrimary }"
        placeholder="required"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label :for="'lName' + cid" class="text-xs mb-1 my-label"
        >Last Name</label
      >
      <input
        :id="'lName' + cid"
        v-model="customerdata.lastname"
        maxlength="40"
        required
        type="text"
        class="my-input"
        :disabled="isPrimary"
        :class="{ 'text-gray-400': isPrimary }"
        placeholder="required"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label :for="'email' + cid" class="text-xs mb-1 my-label">Email</label>
      <input
        :id="'email' + cid"
        v-model="customerdata.email"
        maxlength="50"
        required
        type="email"
        class="my-input"
        :disabled="isPrimary"
        :class="{ 'text-gray-400': isPrimary }"
        placeholder="required"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label :for="'phone' + cid" class="text-xs mb-1 my-label">Phone</label>
      <input
        :id="'phone' + cid"
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
        <label :for="'dob' + cid" class="my-label">Date of Birth</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 fal fa-calendar fa-fw"></i>
          <input
            :id="'dob' + cid"
            class="my-input w-8"
            :value="inputValue"
            v-on="inputEvents"
          />
        </div>
      </template>
    </date-picker>

    <div class="flex flex-col flex-grow group">
      <label :for="'licenseno' + cid" class="text-xs my-label">License #</label>
      <input
        :id="'licenseno' + cid"
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
        <label :for="'licexp' + cid" class="my-label">License Expiry</label>
        <div class="flex flex-row place-items-center">
          <i class="mr-2 form-i fal fa-calendar fa-fw"></i>
          <input
            :id="'licexp' + cid"
            class="my-input w-8"
            :value="inputValue"
            v-on="inputEvents"
          />
        </div>
      </template>
    </date-picker>
    <div class="flex flex-col flex-grow group">
      <label :for="'licenseissued' + cid" class="text-xs my-label"
        >License Issued In</label
      >
      <select
        :id="'licenseissued' + cid"
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
      <label :for="'address' + cid" class="text-xs my-label"
        >Street Address</label
      >
      <input
        :id="'address' + cid"
        v-model="customerdata.address"
        maxlength="80"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label :for="'city' + cid" class="text-xs my-label">City</label>
      <input
        :id="'city' + cid"
        v-model="customerdata.city"
        maxlength="50"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col group">
      <label :for="'state' + cid" class="my-label">State</label>
      <input
        :id="'state' + cid"
        v-model="customerdata.state"
        maxlength="30"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col group">
      <label :for="'country' + cid" class="my-label">Country</label>
      <select
        :id="'country' + cid"
        v-model="customerdata.countryid"
        class="my-input"
      >
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
      <label :for="'postcode' + cid" class="my-label">Postcode</label>
      <input
        :id="'postcode' + cid"
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
        @click="deleteExtraDriver(-customerdata.customerid)"
      >
        Delete <i class="far fa-times"></i>
      </button>
      <button
        v-if="!isPrimary"
        class="btn-green col-start-2"
        @click="addExtraDriver(customerdata.customerid)"
      >
        {{ !newDriver ? 'Update' : 'Add' }} <i class="far fa-cloud-upload"></i>
      </button>
      <button
        v-if="isPrimary"
        class="btn-green col-start-2"
        @click="$emit('save-changes', customerdata)"
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

  computed: {
    cid() {
      return this.$.vnode.key
    },
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

    addExtraDriver(id) {
      let params = {
        method: 'extradriver',
        reservationref: this.$store.state.pbresref,
        customerid: id,
        customer: {
          ...this.customerdata,
        },
      }
      if (
        !this.customerdata.firstname ||
        !this.customerdata.lastname ||
        !this.customerdata.email
      ) {
        alert('please fill all required fields')
        return
      }
      Mixins.methods
        .postapiCall(params)
        .then((res) => {
          console.log(res)
          this.$emit('update')
        })
        .catch((err) => console.log(err))
    },

    deleteExtraDriver(id) {
      let params = {
        method: 'extradriver',
        reservationref: this.$store.state.pbresref,
        customerid: id,
      }
      Mixins.methods
        .postapiCall(params)
        .then((res) => {
          console.log(res)
          this.$emit('update')
        })
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
