<template>
  <div
    ref="searchResults"
    class="text-left rounded w-full searchResults relative"
  >
    <div v-if="filteredVehicles.length" class="text-right">
      <label class="text-sm mr-2" for="sort">sort by:</label>
      <select id="sort" v-model="filter" class="my-input" name="sort">
        <option value="default">default</option>
        <option value="pricelow">lowest price</option>
        <option value="pricehigh">highest price</option>
      </select>
    </div>
    <search-result
      v-for="car in filteredVehicles"
      :key="car.vehiclecategory"
      :data="car"
      :manfees="getFees(car.vehiclecategorytypeid, car.vehiclecategoryid)"
      :all-data="step2"
      @select-vehicle="selectVehicle"
    >
    </search-result>
  </div>
</template>
<script>
import SearchResult from '@/components/booking/SearchResult.vue'
export default {
  components: {
    SearchResult,
  },

  emits: ['select-vehicle', 'results-mounted'],

  data() {
    return {
      categories: [],
      loading: false,
      filter: 'default',
      showAlert: true,
    }
  },

  computed: {
    filteredVehicles() {
      const sorters = {
        // default returns original order from rcm
        default: () => {},
        pricelow: (a, b) => this.calcEstimate(a) - this.calcEstimate(b),
        pricehigh: (a, b) => this.calcEstimate(b) - this.calcEstimate(a),
      }
      return this.step2.availablecars
        .filter((car) => car.availablemessage == 'Available for booking')
        .slice()
        .sort(sorters[this.filter])
    },
    step2() {
      return this.$store.state.step2
    },
    searchParams() {
      return this.$store.state.searchParams
    },
    numAvailable() {
      let count = 0
      if (this.step2.availablecars) {
        this.step2.availablecars.forEach((el) => {
          if (el.available) {
            count++
          }
        })
      }
      return count
    },
  },

  mounted() {
    let arr = []
    if (this.step2.availablecars) {
      this.step2.availablecars.forEach(function (el) {
        if (
          arr.indexOf(el.vehiclecategorytypeid) < 0 &&
          el.availablemessage != 'Not available due to incomplete rates.'
        ) {
          arr.push(el.vehiclecategorytypeid)
        }
      })
    }
    this.categories = arr
    this.$emit('results-mounted')
    this.$refs.searchResults.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
    this.ecommView(this.step2.availablecars)
  },

  methods: {
    selectVehicle(data, step) {
      this.$emit('select-vehicle', data, step)
    },
    ecommView(cars) {
      let items = []
      cars.forEach((car) => {
        items.push({
          item_name: car.categoryfriendlydescription, // Product Name- Type: String
          item_id: car.vehiclecategoryid.toString(), // Product ID/SKU- Type: String
          price: car.totalrateafterdiscount, // Product price - Type: numeric
          item_brand: 'Allridey', //Product brand - Type: string
          item_category: car.vehiclecategorytypeid.toString(), // Product category Main - Type: string
          item_list_name: 'Search Results', // Product List Name - Type: string
          original_price: car.totalratebeforediscount,
          days: car.numberofdays,
        })
      })
      this.$gtag.event('view_item_list', {
        currency: 'AUD',
        event_category: 'ecommerce',
        items: items,
      })
    },

    // getCats(catids) {
    //   let arr = []
    //   let all = this.step2.categorytypes
    //   catids.forEach(function (el) {
    //     all.forEach(function (x) {
    //       if (x.id == el) {
    //         arr.push(x)
    //       }
    //     })
    //   })
    //   return arr
    // },
    // getCars(categorytypeid) {
    //   let arr = []
    //   this.step2.availablecars.forEach(function (el) {
    //     if (el.vehiclecategorytypeid == categorytypeid && el.available) {
    //       arr.push(el)
    //     }
    //   })
    //   return arr
    // },

    calcEstimate(car) {
      let totalRate = car.totalrateafterdiscount
      let totalFees = 0
      this.step2.mandatoryfees.forEach(function (el) {
        if (
          el.vehiclecategorytypeid == car.vehiclecategorytypeid &&
          el.vehiclecategoryid == car.vehiclecategoryid
        ) {
          totalFees += el.totalfeeamount
        }
      })
      return totalRate + totalFees
    },

    getFees(categorytypeid, categoryid) {
      let arr = []
      this.step2.mandatoryfees.forEach(function (el) {
        if (
          el.vehiclecategorytypeid == categorytypeid &&
          el.vehiclecategoryid == categoryid
        ) {
          arr.push(el)
        }
      })
      return arr
    },
  },
}
</script>

<style>
.search-results {
  min-height: 10rem;
}
</style>
