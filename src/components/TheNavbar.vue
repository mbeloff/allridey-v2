<template>
  <div class="w-full h-20 shadow-lg bg-white z-10 relative print:hidden">
    <div class="flex justify-between h-full mx-auto px-2">
      <div class="left flex content-center items-center gap-x-4 w-full">
        <router-link :to="{ name: 'Home' }" href="/" class="left flex">
          <img
            src="../assets/allridey_text_outline.svg"
            alt="Go to Allridey homepage"
            class="flex-grow w-32 md:w-48"
          />
        </router-link>
        <div class="hidden md:flex h-full w-full flex-grow items-center">
          <router-link :to="{ name: 'Search' }" class="menu-item"
            >Book Now</router-link
          >

          <nav-item
            class="menu-item"
            :firstlabel="'Locations'"
            :label="'Location'"
            :items="split"
            :itemlabel="'location'"
          ></nav-item>

          <router-link :to="{ name: 'Contact' }" class="menu-item"
            >Contact</router-link
          >
          <div class="flex flex-col ml-auto">
            <a
              :href="`tel:${$store.state.phone.replaceAll(' ', '')}`"
              class="min-w-max font-bold text-blue-800 ml-auto hover:text-blue-600"
              >AUS: {{ $store.state.phone }}</a
            >
            <a
              :href="`tel:${$store.state.phonenz.replaceAll(' ', '')}`"
              class="min-w-max font-bold text-blue-800 ml-auto hover:text-blue-600"
              >NZ: {{ $store.state.phonenz }}</a
            >
          </div>

          <a :href="$store.state.checkinurl" class="ml-4 menu-item menu-button"
            ><i class="fal fa-sign-in mr-1"></i> Check in</a
          >
        </div>
      </div>
      <div
        class="md:hidden flex h-full place-items-center text-blue-800"
        @click="expand = !expand"
      >
        <div class="flex flex-col text-sm mr-3">
          <a
            :href="`tel:${$store.state.phone.replaceAll(' ', '')}`"
            class="min-w-max font-bold text-blue-800 ml-auto hover:text-blue-600"
            >AUS: {{ $store.state.phone }}</a
          >
          <a
            :href="`tel:${$store.state.phonenz.replaceAll(' ', '')}`"
            class="min-w-max font-bold text-blue-800 ml-auto hover:text-blue-600"
            >NZ: {{ $store.state.phonenz }}</a
          >
        </div>

        <i v-if="!expand" class="fal fa-bars fa-2x fa-fw"></i>
        <i v-if="expand" class="fal fa-times fa-2x fa-fw"></i>
      </div>
    </div>
    <transition name="slide">
      <div
        v-if="expand"
        class="absolute bg-white flex flex-col top-100 gap-2 md:hidden shadow-xl w-full py-2 font-bold text-sm"
      >
        <router-link
          :to="{ name: 'Search' }"
          class="hover:bg-gray-200 px-5 py-3"
          >Book Now</router-link
        >

        <router-link
          :to="{ name: 'Locations' }"
          class="hover:bg-gray-200 px-5 py-3"
          >Locations</router-link
        >

        <router-link :to="{ name: 'Contact' }" class="menu-item"
          >Contact</router-link
        >

        <a
          :href="$store.state.checkinurl"
          class="hover:bg-gray-200 px-5 py-3 menu-item menu-button max-w-max rounded-full mx-auto text-sm"
          ><i class="fal fa-sign-in mr-1"></i> Check In</a
        >
        <!-- <a href="tel:1800246869" class="font-bold text-blue-600 py-3">1800 24 68 69 </a>       -->
      </div>
    </transition>
  </div>
</template>
<script>
import Mixins from '../Mixins'
import NavItem from './NavItem.vue'
export default {
  components: {
    NavItem,
  },
  mixins: [Mixins],
  data() {
    return {
      // locations: [],
      expand: false,
    }
  },
  computed: {
    // * exclude unavailable locations
    locations() {
      return [...this.$store.state.locations].filter(
        (el) => el.ispickupavailable || el.isdropoffavailable
      )
    },
    split() {
      let au = [{ location: 'Australia', id: null }]
      let auArr = this.locations.filter((el) => el.country == 'Australia')
      let nz = [{ location: 'New Zealand', id: null }]
      let nzArr = this.locations.filter((el) => el.country == 'New Zealand')
      return au.concat(auArr, nz, nzArr)
    },
  },
  watch: {
    $route() {
      this.expand = false
    },
  },
  mounted() {
    if (!this.$store.state.locations.length) {
      this.getLocations()
    }
  },
  methods: {
    sort(list) {
      return list.sort(function (a, b) {
        if (a.location < b.location) {
          return -1
        }
        if (a.location > b.location) {
          return 1
        }
        return 0
      })
    },
    getLocations() {
      var params = JSON.stringify({
        method: 'locationdetails',
      })
      Mixins.methods
        .apiCall(params)
        .then((res) => this.$store.dispatch('locations', this.sort(res)))
    },
  },
}
</script>

<style lang="postcss">
.menu-item {
  @apply relative px-5 py-1 text-blue-900;
}

.menu-item:hover {
  @apply text-blue-700;
}

.menu-button {
  @apply bg-blue-500 rounded bg-gradient-to-tr from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/20;
}

.menu-button:hover {
  @apply bg-gray-200 shadow-inner from-gray-200 to-gray-300;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease, opacity 0.35s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
