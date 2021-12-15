<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1 text-left bg-white border p-2 rounded mt-2 relative mb-2">
    <loading-overlay v-if="loading"></loading-overlay>
    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">Arrival Flight</label>
        <input maxlength="50" type="text" class="my-input" v-model="bookingdata.bookinginfo[0].flightin">
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">Arrival Collection Point</label>
        <input maxlength="80" type="text" class="my-input" v-model="bookingdata.bookinginfo[0].arrivalpoint">
    </div>
    <div class="flex flex-col group">
      <label for="state" class=" my-label">Departure Flight</label>
        <input maxlength="50" type="text" class="my-input" v-model="bookingdata.bookinginfo[0].flightout">
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="postcode" class=" my-label">Departure Dropoff Point</label>
        <input maxlength="80" type="text" class="my-input" v-model="bookingdata.bookinginfo[0].departurepoint">
    </div>
    <div class="flex flex-col group">
      <label for="travelling" class=" my-label">Number of People Travelling</label>
        <select name="travelling" id="travelling" class="my-input flex-initial" v-model="bookingdata.bookinginfo[0].numbertravelling">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6+">6+</option>
        </select>
    </div>
    <div class="grid group">
      <label for="remark" class=" my-label">Comments</label>
      <textarea maxlength="250" type="text" name="remark" id="remark" class="my-input" v-model="bookingdata.bookinginfo[0].remark"></textarea>
    </div>

    <div class="grid grid-cols-2 gap-3 h-8 mt-3 md:col-start-2">
      <button class="btn-green col-start-2" @click="$emit('saveChanges')">Update <i class="far fa-cloud-upload"></i></button>
    </div>

  </div>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay.vue'
  import Mixins from '@/Mixins'
  export default {
    components: {
      LoadingOverlay
    },
    mixins: [Mixins],
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      bookingdata: Object,
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
  }
</script>

<style lang="postcss" scoped>
  .my-input {
    padding: .25rem
  }
  @layer components {
    textarea.my-input {
          @apply border flex-1 pl-2 bg-gray-200 rounded
        }
  }
  
</style>
