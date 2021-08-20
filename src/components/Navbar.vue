<template>
  <div class="w-full h-20 shadow-lg bg-white z-10 relative">
    <div class="flex justify-between container h-full mx-auto px-2"> 
      <div class="left flex content-center items-center gap-x-4 ">
        <router-link :to="{ name: 'Home'}" href="/" class="left flex">
          <img src="../assets/allridey_text_outline.svg" alt="" class="flex-grow w-32 md:w-48">
        </router-link>        
        <div class="hidden md:flex h-full items-center">
          <router-link :to="{ name: 'Search'}" class="menu-item">Book Now</router-link>
          <nav-item class="menu-item" :firstlabel="'Locations'" :label="'Location'" :items="split" :itemlabel="'location'"></nav-item>
        </div>
        
      </div>
      
    <div class="hidden md:flex h-full place-items-center">
      <a href="tel:1800246869" class="font-bold text-blue-600">1800 24 68 69</a>      
    </div>
    <div class="md:hidden flex h-full place-items-center text-blue-800" @click="expand = !expand">
      <i class="fas fa-bars fa-2x fa-fw" v-if="!expand"></i>
      <i class="fas fa-times fa-2x fa-fw" v-if="expand"></i>
    </div>
    </div>
    <transition name="slide">
      <div v-if="expand" class="absolute bg-white flex flex-col top-100 gap-2 md:hidden shadow-xl w-full">
        <router-link :to="{ name: 'Search' }" class="hover:bg-gray-200 px-5 py-3">Book Now</router-link>
        <router-link :to="{ name: 'Locations' }" class="hover:bg-gray-200 px-5 py-3">Locations</router-link>
        <a href="tel:1800246869" class="font-bold text-blue-600 py-3">1800 24 68 69 </a>      
      </div>
    </transition>    
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
      // locations: [],
      expand: false,
    }
  },
  computed: {
    // * exclude unavailable locations
    locations() {
      return [...this.$store.state.locations].filter(el => el.ispickupavailable || el.isdropoffavailable)
    },
    split() {
      let au = [{location:'Australia', id:null}]
      let auArr = this.locations.filter(el => el.country == 'Australia')
      let nz = [{location:'New Zealand', id:null}]
      let nzArr = this.locations.filter(el => el.country == 'New Zealand')
      return au.concat(auArr, nz, nzArr)
    },
  },
  mounted() {
    if (!this.$store.state.locations.length) {
      this.getLocations()
    }
  },
  watch: {
    $route(to, from){
      this.expand = false
    }
  },
  mixins: [Mixins],
  methods: {
  },
  methods: {
    sort(list) {
    return list.sort(function( a, b ) {
      if ( a.location < b.location ){
        return -1;
      }
      if ( a.location > b.location ){
        return 1;
      }
      return 0;
    })
    },
    getLocations() {        
      var params = JSON.stringify({
        'method':'locationdetails'
      })
      Mixins.methods.apiCall(params).then(res=> this.$store.dispatch('locations', this.sort(res)))
    },
  }
}
</script>

<style lang="postcss">
.menu-item {
  @apply font-bold relative px-5 py-1 text-blue-900
}

.menu-item:hover {
  @apply bg-gray-200
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.35s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0
}
</style>