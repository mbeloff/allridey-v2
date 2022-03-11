<template>
  <div class="bg-gray-300 w-full h-full py-10 px-2">
    <div
      class="max-w-screen-lg mx-auto bg-white rounded shadow-xl place-items-center justify-center relative"
    >
      <div
        v-if="loading"
        class="absolute grid place-items-center w-full h-full bg-gray-200 bg-opacity-80"
      >
        <spinner></spinner>
      </div>
      <div class="w-full h-56">
        <iframe
          class="rounded-t"
          :src="data.mapurl"
          style="border: 0"
          allowfullscreen=""
          width="100%"
          height="100%"
          loading="lazy"
        ></iframe>
      </div>
      <div class="p-5 text-left flex flex-col gap-2">
        <p class="font-bold text-lg text-blue-700">
          Allridey {{ data.location }}
        </p>
        <div
          class="mb-2 flex flex-col gap-2 text-sm"
          v-html="data.webdescription"
        ></div>

        <div class="flex items-center">
          <i class="far fa-map-marker fa-fw text-blue-700 mr-2"></i>
          <span
            >{{ data.address }}, {{ data.suburb }} {{ data.postcode }}
            {{ data.state }}</span
          >
        </div>
        <div class="flex items-center">
          <i class="far fa-envelope fa-fw text-blue-700 mr-2"></i>
          <a
            class="text-blue-600 hover:underline"
            :href="`mailto:` + $store.state.email"
            >{{ $store.state.email }}</a
          >
        </div>
        <div class="flex">
          <i class="far fa-clock fa-fw text-blue-700 mt-1.5 mr-2"></i>
          <div>
            <div class="w-56 flex justify-between items-center">
              <span class="w-24">mon-fri:</span>
              <span class="w-32">9am - 4pm</span>
            </div>
            <div class="w-56 flex justify-between items-center">
              <span class="w-24">sat:</span>
              <span class="w-32">9am - 12pm</span>
            </div>
            <div class="w-56 flex justify-between items-center">
              <span class="w-24">sun:</span> <span class="w-32">closed</span>
            </div>
            <p class="text-sm mt-2">
              After hours contactless pick up and drop off are available. Fees
              may apply.
            </p>
          </div>
        </div>
        <router-link
          :to="{ name: 'Search', params: { loc: $route.params.name } }"
          class="btn btn-primary flex-initial w-max mt-4"
          >Book Now</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from '../components/SpinnerIcon.vue'
import Mixins from '../Mixins'
export default {
  components: {
    Spinner,
  },
  mixins: [Mixins],
  data() {
    return {
      loading: true,
      data: {},
      all: [],
    }
  },
  computed: {
    id() {
      if (!this.$attrs.id) {
        let name = this.$attrs.name
        let id
        this.all.forEach((el) => {
          if (this.replaceSpace(el.location) == name) {
            id = el.id
          }
        })
        return id
      } else return undefined
    },
  },
  watch: {
    // ! get location via attr.id or derive from attr.name
    '$attrs.id': function () {
      this.loading = true
      this.getLocation(this.$attrs.id)
    },
    id: function () {
      if (!this.$attrs.id) {
        this.loading = true
        this.getLocation(this.id)
      }
    },
    '$route.params.name': {
      handler: function () {
        window.scrollTo(0, 0)
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    if (this.$attrs.id) {
      this.getLocation(this.$attrs.id)
    } else {
      this.getall()
    }
    window.scrollTo(0, 0)
  },
  methods: {
    getall() {
      var params = JSON.stringify({
        method: 'locationdetails',
      })
      Mixins.methods.apiCall(params).then((res) => (this.all = res))
    },
    getLocation(id) {
      var params = JSON.stringify({
        method: 'locationdetails',
        id: id,
      })
      Mixins.methods.apiCall(params).then((res) => (this.data = res[0]))
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    replaceSpace(str) {
      return str.replace(/\s+/g, '-').toLowerCase()
    },
  },
}
</script>

<style></style>
