<template>
<div class="container mx-auto grid gap-5 py-10">
  <booking-nav @changeStep="changeStep" :status="status"></booking-nav>
  <booking-form @update-status="updateStatus" @update-search-results="updateSearchResults"></booking-form>
  <search-results v-if="status == 2 && this.searchResults" :results="this.searchResults" :key="this.count" :submittedParams="this.submittedParams"></search-results>
</div>
  
</template>
<script>
import BookingForm from '../components/BookingForm.vue'
import BookingNav from '../components/BookingNav.vue'
import SearchResults from '../components/SearchResults.vue'
export default {
  components: {BookingForm, BookingNav, SearchResults},
  data() {
    return {
      status: 1,
      submittedParams: {},
      searchResults: {},
      count: 0
    }
  },
  methods: {
    changeStep(e) {
      this.updateStatus(e)
      // if (e == 1) {
        this.submittedParams = {},
        this.searchResults = {}
      // }
    },
    updateStatus(e) {
        this.status = e;
    },
    updateSearchResults(e, f) {
      this.searchResults = e
      this.submittedParams = f
      this.count++
      this.$forceUpdate()
    }
  }
}
</script>

<style>

</style>