<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 gap-3 gap-y-1 text-left bg-white border p-2 rounded mt-2 relative mb-2"
  >
    <loading-overlay v-if="loading"></loading-overlay>
    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">Arrival Flight</label>
      <input
        v-model="workingdata.bookinginfo[0].flightin"
        maxlength="50"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="" class="text-xs my-label">Arrival Collection Point</label>
      <input
        v-model="workingdata.bookinginfo[0].arrivalpoint"
        maxlength="80"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col group">
      <label for="state" class="my-label">Departure Flight</label>
      <input
        v-model="workingdata.bookinginfo[0].flightout"
        maxlength="50"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col flex-grow group">
      <label for="postcode" class="my-label">Departure Dropoff Point</label>
      <input
        v-model="workingdata.bookinginfo[0].departurepoint"
        maxlength="80"
        type="text"
        class="my-input"
      />
    </div>
    <div class="flex flex-col group">
      <label for="travelling" class="my-label"
        >Number of People Travelling</label
      >
      <select
        id="travelling"
        v-model="workingdata.bookinginfo[0].numbertravelling"
        name="travelling"
        class="my-input flex-initial"
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6+">6+</option>
      </select>
    </div>
    <div class="grid group">
      <label for="remark" class="my-label w-full">Comments</label>
      <textarea
        id="remark"
        v-model="workingdata.bookinginfo[0].remark"
        maxlength="250"
        type="text"
        name="remark"
        class="my-input w-full"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-3 h-8 mt-3 md:col-start-2">
      <button class="btn-green col-start-2" @click="$emit('save-changes', workingdata)">
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
  },
  emits: ['save-changes'],
  data() {
    return {
      workingdata: this.bookingdata
    }
  }
}
</script>

<style lang="postcss" scoped>
.my-input {
  padding: 0.25rem;
}
textarea.my-input {
  @apply border flex-1 pl-2 bg-gray-200 rounded;
}
</style>
