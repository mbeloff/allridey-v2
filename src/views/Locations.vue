<template>
  <div class="bg-gray-200 w-full h-full py-10">
    <div class="bg-white rounded shadow-xl max-w-screen-lg mx-auto py-5 flex flex-col place-items-center justify-center">
      <p class="text-2xl font-bold text-blue-800">Our Locations</p>
      <div class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-3">
        <div class="w-full flex flex-col shadow-xl gap-3 p-2" v-for="(location, i) in sorted" :key="location.id">
          <div class="w-full h-42 relative">
            <div class="w-full h-full absolute bg-blue-700 bg-opacity-20 overlay"></div>
            <iframe :src=" location.mapurl " style="border:0;" allowfullscreen="" width="100%" loading="lazy"></iframe>
          </div>
          <p class="font-bold ">{{location.location}}</p>
          <p>{{location.address}}</p>
          <button class="btn btn-secondary">more info</button>
        </div>
      </div>

    </div>
  </div>

</template>

<script>
  import Mixins from '../Mixins'
  export default {
    data() {
      return {
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
    watch: {},
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