<template>
  <div class="w-full h-20 shadow-lg bg-white z-10">
    <div class="flex justify-between container h-full mx-auto px-2"> 
      <div class="left flex content-center items-center gap-x-4">
        <a href="/" class="left flex">
          <img src="../assets/allridey_text_outline.svg" alt="" class="flex-grow w-32 md:w-48">
        </a>
        <router-link :to="{ name: 'Search' }" class="hover:bg-gray-200 px-5 py-1">Bookings</router-link>
        <nav-item :firstlabel="'Locations'" :label="'Location'" :items="sorted" :itemlabel="'location'"></nav-item>
      </div>
      
    <div class="right h-full flex place-items-center">
      <a href="tel:1800246869" class="font-bold text-blue-600">1800 24 68 69</a>
    </div>
    </div>
  </div>
</template>

<script>
import Mixins from '../Mixins'
import NavItem from '../components/NavItem.vue'
export default {
  components: {
    NavItem
  },
  data() {
    return {
      locations: [],
    }
  },
  computed: {
    sorted() {
      return JSON.parse(JSON.stringify(this.locations)).sort(function( a, b ) {
      if ( a.location < b.location ){
        return -1;
      }
      if ( a.location > b.location ){
        return 1;
      }
      return 0;
    })
    },
  },
  mounted() {
    this.getLocations()
  },
  watch: {
  },
  mixins: [Mixins],
  methods: {
  },
  methods: {
    getLocations() {        
      var params = JSON.stringify({
        'method':'locationdetails'
      })
      Mixins.methods.apiCall(params).then(res=> this.locations = res)
    },
  }
}
</script>

<style>
</style>