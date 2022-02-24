<template>
  <div class="bg-white p-2 rounded mt-5 shadow-xl w-full text-left md:max-w-screen-lg mx-auto">
    <p class="font-bold text-lg mb-3 mt-5">License <span class="font-normal text-gray-400">optional</span></p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="licenseno" class="text-xs my-label">License #</label>
          <input maxlength="80" type="text" id="licenseno" class="my-input" v-model="parameters.customer.licenseno">
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="licenseissued" class="text-xs my-label">Country of Issue</label>
          <select id="licenseissued" class="my-input" v-model="parameters.customer.licenseissued">
            <option v-for="country in step3.countries" :value="country.id">{{country.country}}</option>
          </select>
      </div>
      <date-picker v-model="parameters.customer.licenseexpires" :min-date="new Date()" :update-on-input="false" class="flex flex-col flex-grow group" :model-config="dateconfig">
        <template v-slot="{ inputValue, inputEvents }">
          <label for="" class="my-label">License Expiry</label>
          <div class="flex flex-row place-items-center">
            <i class="mr-2 form-i fal fa-calendar fa-fw"></i>
            <input class="my-input" :value="inputValue" v-on="inputEvents" />
          </div>
        </template>
      </date-picker>
    </div>

    <p class="font-bold text-lg mb-3 mt-5">Address <span class="font-normal text-gray-400">optional</span></p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs my-label">Street Address</label>
          <input maxlength="80" type="text" id="address" class="my-input" v-model="parameters.customer.address">
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs my-label">City</label>
          <input maxlength="50" type="text" id="city" class="my-input" v-model="parameters.customer.city">
      </div>
      <div class="flex flex-col group">
        <label for="state" class=" my-label">State</label>
          <input maxlength="30" type="text" id="state" class="my-input" v-model="parameters.customer.state">
      </div>
      <div class="flex flex-col group">
        <label for="country" class=" my-label">Country</label>
          <select id="country" class="my-input" v-model="parameters.customer.countryid">
            <option v-for="country in step3.countries" :value="country.id">{{country.country}}</option>
          </select>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="postcode" class=" my-label">Postcode</label>
          <input maxlength="10" type="text" id="postcode" class="my-input" v-model="parameters.customer.postcode">
      </div>
    </div>


    <p class="font-bold text-lg mb-3 mt-5">Trip Details <span class="font-normal text-gray-400">optional</span></p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="flightin" class="text-xs my-label">Arrival Flight</label>
          <input maxlength="50" type="text" id="flightin" class="my-input" v-model="parameters.flightin">
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="arrivalpoint" class="text-xs my-label">Pick up Point</label>
          <input maxlength="80" type="text" id="arrivalpoint" class="my-input" v-model="parameters.arrivalpoint">
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="flightout" class="text-xs my-label">Departure Flight</label>
          <input maxlength="50" type="text" id="flightout" class="my-input" v-model="parameters.flightout">
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="departurepoint" class="text-xs my-label">Drop off point</label>
          <input maxlength="80" type="text" id="departurepoint" class="my-input" v-model="parameters.departurepoint">
      </div>

      <div class="flex flex-col flex-grow group">
        <label for="travellers" class=" my-label">How Many Travelling?</label>
          <select id="travellers" class="my-input" v-model="parameters.numbertravelling">
            <option selected disabled value="">number of people travelling</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6+">6+</option>
          </select>
      </div>

      <div class="flex flex-col flex-grow group">
        <label for="transmission" class=" my-label">Transmission</label>
          <select id="transmission" class="my-input" v-model="parameters.transmission">
            <option value="0">No Preference</option>
            <option value="1">Automatic</option>
            <option value="2">Manual</option>
            </select>
      </div>

      <div class="flex flex-col flex-grow group">
        <label for="remark" class=" my-label">Comments/Requests</label>
          <textarea maxlength="250" rows="3" id="remark" class="my-input flex-initial" v-model="parameters.remark"></textarea>
      </div>

      <div class="flex flex-col self-start group mt-1">
        <label for="foundus" class=" my-label">How did you hear about us?</label>
          <select id="foundus" class="my-input" v-model="parameters.foundusid">
            <option :value="foundusGeneric.id">-</option>
            <option v-for="(item, i) in foundus.filter(el => el.isdefault == false)" :value="item.id" :key="item.id">{{item.rentalsource}}</option>            
            </select>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dateconfig: {
        type: 'string',
        mask: 'DD/MM/YYYY', // Uses 'iso' if missing
      },
      }
    },
    props: {
      parameters: Object,
      step3: Object,
      foundus: Array
    },
    computed: {
      foundusGeneric() {
        let item = this.foundus.find(el => el.isdefault)
        return item     
      },
    },
  }
</script>

<style>

</style>