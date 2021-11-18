<template>
   <div class="py-10 container max-w-screen-lg mx-auto px-0 md:px-5">
      <div class="flex flex-col md:flex-row gap-3 items-start">
        <!-- LEFT SIDE -->
        <div class="w-full md:w-2/6 order-2 md:order-1 shadow-2xl border">
          <section-summary :bookingdata="bookingdata"></section-summary>
        </div>  
        <!-- RIGHT SIDE -->
        <div class="flex flex-col w-full md:w-4/6 flex-shrink order-1 md:order-2">
          <div class="flex flex-col shadow-xl bg-gray-200 p-5 gap-2 py-10 mb-5">
            <div class="grid grid-cols-3 gap-3 h-12">
              <button class="btn-primary rounded" @click="setTab('drivers')">Additional Drivers</button>
              <button class="btn-primary rounded" @click="setTab('extras')">Optional Extras</button>
              <button class="btn-primary rounded" @click="setTab('uploads')">Upload Documents</button>
            </div>
            <section-drivers v-show="tab == 'drivers'" :bookingdata="bookingdata" @update="$emit('update')" :customer="customer"></section-drivers>
            <section-extras v-show="tab == 'extras'" :bookingdata="bookingdata"></section-extras>
            <section-uploads v-show="tab == 'uploads'"></section-uploads>
          </div>
        </div>       
    </div>
  </div>
</template>

<script>
import SectionExtras from '../components/SectionExtras.vue'
import SectionUploads from '../components/SectionUploads.vue'
import SectionSummary from '../components/SectionSummary.vue'
import SectionDrivers from '../components/SectionDrivers.vue'
export default {
  props: {
    bookingdata: Object,
    customer: Object
  },
  components: {
    SectionSummary,
    SectionDrivers,
    SectionUploads,
    SectionExtras
  },
  data() {
    return {
      tab: ""
    }
  },
  methods: {
    setTab(str) {
      if (this.tab == str) {
        this.tab = ""
      } else {
        this.tab = str
      }
      
    }
  }
}
</script>

<style>

</style>