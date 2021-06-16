<template>
  <div class="text-left">
    <p class="text-center" v-if="categories.length > 0">search results</p>
    <p class="text-center" v-else>No results found</p>
    <div v-for="(cat, i) in getCats(categories)" class="my-2">
        <div class="flex bg-gray-600 text-white px-2">
          <p>{{cat.vehiclecategorytype}}</p>
        </div>
        <search-result v-for="(car, i) in getCars(cat.id)" 
        :key="car.vehiclecategory" 
        :data="car" 
        :manfees="getFees(car.vehiclecategorytypeid, car.vehiclecategoryid)"
        :allData="results"
        :step2="step2">
        </search-result>
    </div>
    </div>
</template>

<script>
import SearchResult from './SearchResult.vue'
export default {
  components: {SearchResult},
  data() {
    return {
      categories: []
    }
  },
  props: {
    results: Object,
    step2: Object
  },
  mounted() {
    let arr = []
    this.results.availablecars.forEach(function(el) {
      if (arr.indexOf(el.vehiclecategorytypeid) < 0 && el.availablemessage != 'Not available due to incomplete rates.'){
        arr.push(el.vehiclecategorytypeid)  
      }       
      })
    this.categories = arr
  },
  methods: {
    getCats(catids) {
      let arr = []
      let all = this.results.categorytypes
      catids.forEach(function(el){
        all.forEach(function(x){
          if (x.id == el) {
            arr.push(x)
          }
        })
      })
      return arr
    },
    getCars(categorytypeid) {
      let arr = []
      this.results.availablecars.forEach(function(el) {
        if (el.vehiclecategorytypeid == categorytypeid){
        arr.push(el)}
      })
      return arr
    },
    getFees(categorytypeid, categoryid) {
       let arr = []
      this.results.mandatoryfees.forEach(function(el) {
        if (el.vehiclecategorytypeid == categorytypeid && el.vehiclecategoryid == categoryid){
        arr.push(el)}
      })
      return arr
    }
  }
}
</script>

<style>

</style>