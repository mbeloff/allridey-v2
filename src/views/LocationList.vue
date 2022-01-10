<template>
  <div class="bg-gray-300 w-full h-full py-10">
    <div class="bg-white rounded shadow-xl max-w-screen-lg mx-auto py-5 flex flex-col place-items-center justify-center relative">
      <div v-if="loading" class="absolute bg-gray-200 bg-opacity-80 mx-auto h-full w-full grid place-items-center">
          <spinner></spinner>
        </div>
      <div class="text-4xl font-extrabold py-5">
        <span class="text-blue-700">
          Our Locations
        </span>
      </div>
      <div v-if="loading" class="h-48"></div>
      <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-3 p-2">
        <div class="w-full flex flex-col shadow-xl gap-3 p-2 border border-gray-200" v-for="(location, i) in split" :key="location.id">
          <div class="w-full h-42 relative">
            <div class="w-full h-full absolute bg-blue-900 bg-opacity-20 overlay" :class="{ 'bg-green-600' : location.state == 'NZ'}"></div>
            <!-- <iframe :src=" location.mapurl " style="border:0;" allowfullscreen="" width="100%" loading="lazy"></iframe> -->
          </div>
          <div class="flex flex-col gap-3 text-left flex-grow">
            <div class="pl-2 text-sm">
              <p class="font-bold text-lg text-blue-900" :class="{ 'text-green-600' : location.state == 'NZ'}">{{location.location}}</p>
              <p class="">{{location.address}} </p>
              <p v-if="location.suburb">{{location.suburb}}</p>
              <p>{{location.state}}</p>
            </div>
            
          <router-link :to="{name: 'Location', params: {name:replaceSpace(location.location), id:location.id}}" class="btn btn-secondary mt-auto" :class="{ 'text-green-600' : location.state == 'NZ'}">more info</router-link>
          </div>         
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
  import Mixins from '../Mixins'
  import Spinner from '../components/Spinner.vue'
  export default {
    components: {Spinner},
    data() {
      return {
        // loading: true,
      }
    },
    computed: {
      locations() {
         return [...this.$store.state.locations].filter(el => el.ispickupavailable || el.isdropoffavailable)
      },
      split() {
        let auArr = this.locations.filter(el => el.country == 'Australia')
        let nzArr = this.locations.filter(el => el.country == 'New Zealand')
        return auArr.concat(nzArr)
      },
      loading() {
        if (this.locations.length) {
          return false
        } else {
          return true
        }
      }
    },
    watch: {
      'locationcount': function() {
          this.loading = false
      },
    },
    mixins: [Mixins],
    methods: {},
    methods: {
      replaceSpace(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
      }
    }
  }
</script>

<style>
.overlay {
  pointer-events: none
}
</style>