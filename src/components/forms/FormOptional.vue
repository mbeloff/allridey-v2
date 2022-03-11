<template>
  <div
    class="bg-white p-2 rounded mt-5 shadow-xl w-full text-left md:max-w-screen-lg mx-auto"
  >
    <p class="font-bold text-lg mb-3 mt-5">
      License <span class="font-normal text-gray-400">optional</span>
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="licenseno" class="text-xs my-label">License #</label>
        <input
          id="licenseno"
          v-model="parameters.customer.licenseno"
          maxlength="80"
          type="text"
          class="my-input"
        />
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="licenseissued" class="text-xs my-label"
          >Country of Issue</label
        >
        <select
          id="licenseissued"
          v-model="parameters.customer.licenseissued"
          class="my-input"
        >
          <option
            v-for="country in step3.countries"
            :key="country.id"
            :value="country.id"
          >
            {{ country.country }}
          </option>
        </select>
      </div>
      <date-picker
        v-model="parameters.customer.licenseexpires"
        :min-date="new Date()"
        :update-on-input="false"
        class="flex flex-col flex-grow group"
        :model-config="dateconfig"
      >
        <template #default="{ inputValue, inputEvents }">
          <label for="" class="my-label">License Expiry</label>
          <div class="flex flex-row place-items-center">
            <i class="mr-2 form-i fal fa-calendar fa-fw"></i>
            <input class="my-input" :value="inputValue" v-on="inputEvents" />
          </div>
        </template>
      </date-picker>
    </div>

    <p class="font-bold text-lg mb-3 mt-5">
      Address <span class="font-normal text-gray-400">optional</span>
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs my-label">Street Address</label>
        <input
          id="address"
          v-model="parameters.customer.address"
          maxlength="80"
          type="text"
          class="my-input"
        />
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs my-label">City</label>
        <input
          id="city"
          v-model="parameters.customer.city"
          maxlength="50"
          type="text"
          class="my-input"
        />
      </div>
      <div class="flex flex-col group">
        <label for="state" class="my-label">State</label>
        <input
          id="state"
          v-model="parameters.customer.state"
          maxlength="30"
          type="text"
          class="my-input"
        />
      </div>
      <div class="flex flex-col group">
        <label for="country" class="my-label">Country</label>
        <select
          id="country"
          v-model="parameters.customer.countryid"
          class="my-input"
        >
          <option
            v-for="country in step3.countries"
            :key="country.id"
            :value="country.id"
          >
            {{ country.country }}
          </option>
        </select>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="postcode" class="my-label">Postcode</label>
        <input
          id="postcode"
          v-model="parameters.customer.postcode"
          maxlength="10"
          type="text"
          class="my-input"
        />
      </div>
    </div>

    <p class="font-bold text-lg mb-3 mt-5">
      Trip Details <span class="font-normal text-gray-400">optional</span>
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="flightin" class="text-xs my-label">Arrival Flight</label>
        <input
          id="flightin"
          v-model="parameters.flightin"
          maxlength="50"
          type="text"
          class="my-input"
        />
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="arrivalpoint" class="text-xs my-label">Pick up Point</label>
        <input
          id="arrivalpoint"
          v-model="parameters.arrivalpoint"
          maxlength="80"
          type="text"
          class="my-input"
        />
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="flightout" class="text-xs my-label">Departure Flight</label>
        <input
          id="flightout"
          v-model="parameters.flightout"
          maxlength="50"
          type="text"
          class="my-input"
        />
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="departurepoint" class="text-xs my-label"
          >Drop off point</label
        >
        <input
          id="departurepoint"
          v-model="parameters.departurepoint"
          maxlength="80"
          type="text"
          class="my-input"
        />
      </div>

      <div class="flex flex-col flex-grow group">
        <label for="travellers" class="my-label">How Many Travelling?</label>
        <select
          id="travellers"
          v-model="parameters.numbertravelling"
          class="my-input"
        >
          <option selected disabled value="">
            number of people travelling
          </option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6+">6+</option>
        </select>
      </div>

      <div class="flex flex-col flex-grow group">
        <label for="transmission" class="my-label">Transmission</label>
        <select
          id="transmission"
          v-model="parameters.transmission"
          class="my-input"
        >
          <option value="0">No Preference</option>
          <option value="1">Automatic</option>
          <option value="2">Manual</option>
        </select>
      </div>

      <div class="flex flex-col flex-grow group">
        <label for="remark" class="my-label">Comments/Requests</label>
        <textarea
          id="remark"
          v-model="parameters.remark"
          maxlength="250"
          rows="3"
          class="my-input flex-initial"
        ></textarea>
      </div>

      <div class="flex flex-col self-start group mt-1">
        <label for="foundus" class="my-label">How did you hear about us?</label>
        <select id="foundus" v-model="parameters.foundusid" class="my-input">
          <option :value="foundusGeneric.id">-</option>
          <option
            v-for="item in foundus.filter((el) => el.isdefault == false)"
            :key="item.id"
            :value="item.id"
          >
            {{ item.rentalsource }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    parameters: Object,
    step3: Object,
    foundus: Array,
  },
  data() {
    return {
      dateconfig: {
        type: 'string',
        mask: 'DD/MM/YYYY', // Uses 'iso' if missing
      },
    }
  },
  computed: {
    foundusGeneric() {
      let item = this.foundus.find((el) => el.isdefault)
      return item
    },
  },
}
</script>

<style></style>
