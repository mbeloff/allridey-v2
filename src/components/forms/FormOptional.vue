<template>
  <div class="bg-white p-2 rounded mt-5 shadow-xl w-full text-left md:max-w-screen-lg mx-auto">
    <p class="font-bold text-lg mb-3 mt-5">License <span class="font-normal text-gray-400">optional</span></p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="licenseno" class="text-xs my-label">License #</label>
        <div class="flex flex-row place-items-center">
          <input type="text" id="licenseno" class="my-input" v-model="parameters.customer.licenseno">
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="licenseissued" class="text-xs my-label">Country of Issue</label>
        <div class="flex flex-row place-items-center">
          <select id="licenseissued" class="my-input" v-model="parameters.customer.licenseissued">
            <option v-for="country in step3.countries" :value="country.id">{{country.country}}</option>
          </select>
        </div>
      </div>
      <date-picker v-model="licenseexpires" :min-date="new Date()" class="flex flex-col flex-grow group">
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
        <div class="flex flex-row place-items-center">
          <input type="text" id="address" class="my-input" v-model="parameters.customer.address">
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="" class="text-xs my-label">City</label>
        <div class="flex flex-row place-items-center">
          <input type="text" id="city" class="my-input" v-model="parameters.customer.city">
        </div>
      </div>
      <div class="flex flex-col group">
        <label for="state" class=" my-label">State</label>
        <div class="flex flex-row place-items-center">
          <input type="text" id="state" class="my-input" v-model="parameters.customer.state">
        </div>
      </div>
      <div class="flex flex-col group">
        <label for="country" class=" my-label">Country</label>
        <div class="flex flex-row place-items-center">
          <select id="country" class="my-input" v-model="parameters.customer.countryid">
            <option v-for="country in step3.countries" :value="country.id">{{country.country}}</option>
          </select>
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="postcode" class=" my-label">Postcode</label>
        <div class="flex flex-row place-items-center">
          <input type="text" id="postcode" class="my-input" v-model="parameters.customer.postcode">
        </div>
      </div>
    </div>


    <p class="font-bold text-lg mb-3 mt-5">Trip Details <span class="font-normal text-gray-400">optional</span></p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1">
      <div class="flex flex-col flex-grow group">
        <label for="travellers" class=" my-label">How Many Travelling?</label>
        <div class="flex flex-row place-items-center">
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
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="transmission" class=" my-label">Transmission</label>
        <div class="flex flex-row place-items-center">
          <select id="transmission" class="my-input" v-model="parameters.transmission">
            <option value="0">No Preference</option>
            <option value="1">Automatic</option>
            <option value="2">Manual</option>
            </select>
        </div>
      </div>
      <div class="flex flex-col flex-grow group">
        <label for="remark" class=" my-label">Comments/Requests</label>
        <div class="flex flex-row place-items-center">
          <textarea rows="3" id="remark" class="my-input" v-model="parameters.remark"></textarea>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {
        licenseexpires: ""
      }
    },
    props: {
      parameters: Object,
      step3: Object
    },
    watch: {
      'licenseexpires': function () {
        this.parameters.customer.licenseexpires = this.licenseexpires.toLocaleDateString()
      }
    },
  }
</script>

<style>

</style>