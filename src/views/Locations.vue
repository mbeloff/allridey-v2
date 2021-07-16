<template>
  <div class="bg-gray-200 w-full h-full py-10">
    <div class="bg-white rounded shadow-xl max-w-screen-lg mx-auto py-5 flex flex-col place-items-center justify-center">
      <div class="text-4xl font-extrabold py-5">
        <span class="text-blue-700">
          Our Locations
        </span>
      </div>
      <div v-if="loading" class="h-48 mx-auto py-5 grid place-items-center justify-center mt-5">
      <spinner></spinner>
    </div>
      <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-3">
        <div class="w-full flex flex-col shadow-xl gap-3 p-2" v-for="(location, i) in sorted" :key="location.id">
          <div class="w-full h-42 relative">
            <div class="w-full h-full absolute bg-blue-900 bg-opacity-20 overlay"></div>
            <iframe :src=" location.mapurl " style="border:0;" allowfullscreen="" width="100%" loading="lazy"></iframe>
          </div>
          <div class="flex flex-col gap-3 text-left flex-grow">
            <div class="pl-2 text-sm">
              <p class="font-bold text-lg text-blue-900">{{location.location}}</p>
              <p class="">{{location.address}} </p>
              <p v-if="location.suburb">{{location.suburb}}</p>
              <p>{{location.state}}</p>
            </div>
            
          <router-link :to="{name: 'Location', params: {name:location.location, id:location.id}}" class="btn btn-secondary mt-auto">more info</router-link>
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
        loading: true,
        locations: []
      }
    },
    computed: {
      sorted() {
        return JSON.parse(JSON.stringify(this.locations)).sort(function (a, b) {
          if (a.location < b.location) {
            return -1;
          }
          if (a.location > b.location) {
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
      'locations': function() {
        this.loading = false
      }
    },
    mixins: [Mixins],
    methods: {},
    methods: {
      getLocations() {
        var params = JSON.stringify({
          'method': 'locationdetails'
        })
        Mixins.methods.apiCall(params).then(res => this.locations = res)
      },
    }
  }
</script>

<style>
.overlay {
  pointer-events: none
}
</style>