<template>
  <div class="text-left bg-white rounded shadow-xl w-full p-1 search-results">   
    <p class="text-center" v-if="numAvailable > 0">search results</p>
    <p class="text-center" v-else>No results found</p>
    <div v-for="(cat, i) in getCats(categories)" class="my-2">
      <!-- <div class="flex bg-gray-600 text-white px-2">
        <p>{{cat.vehiclecategorytype}}</p>
      </div> -->
      <search-result @select-vehicle="selectVehicle" v-for="(car, i) in getCars(cat.id)" :key="car.vehiclecategory" :data="car" :manfees="getFees(car.vehiclecategorytypeid, car.vehiclecategoryid)" :allData="results" :submittedParams="submittedParams">
      </search-result>
    </div>
  </div>
</template>

<script>
  import LoadingOverlay from './LoadingOverlay.vue'
  import SearchResult from './SearchResult.vue'
  export default {
    components: {
      SearchResult,
      LoadingOverlay
    },
    data() {
      return {
        categories: [],
        loading: false,
      }
    },
    props: {
      results: Object | String,
      submittedParams: Object
    },
    mounted() {
      let arr = []
        this.results.availablecars.forEach(function (el) {
        if (arr.indexOf(el.vehiclecategorytypeid) < 0 && el.availablemessage != 'Not available due to incomplete rates.') {
          arr.push(el.vehiclecategorytypeid)
        }
      })
      this.categories = arr          
    },
    computed: {
      numAvailable() {
        let count = 0
        this.results.availablecars.forEach(el => {
          if (el.available) {
            count++
          }
        })
        return count
      }
    },
    methods: {
      selectVehicle(data, step) {
        this.$emit('select-vehicle', data, step)
      },
      getCats(catids) {
        let arr = []
        let all = this.results.categorytypes
        catids.forEach(function (el) {
          all.forEach(function (x) {
            if (x.id == el) {
              arr.push(x)
            }
          })
        })
        return arr
      },
      getCars(categorytypeid) {
        let arr = []
        this.results.availablecars.forEach(function (el) {
          if (el.vehiclecategorytypeid == categorytypeid && el.available) {
            arr.push(el)
          }
        })
        return arr
      },
      getFees(categorytypeid, categoryid) {
        let arr = []
        this.results.mandatoryfees.forEach(function (el) {
          if (el.vehiclecategorytypeid == categorytypeid && el.vehiclecategoryid == categoryid) {
            arr.push(el)
          }
        })
        return arr
      }
    }
  }
</script>

<style>
.search-results {
  min-height: 10rem
}
</style>