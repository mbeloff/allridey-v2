<template>
  <div class="bg-gray-200 grid place-items-center px-2">
    <div class="flex gap-10 py-10">
      <div class="gap-2 text-sm text-left flex flex-col">
        <router-link v-for="location in locations" :key="location.city" class="hover:underline" :to="{path: '/location/' + location.city.toLowerCase().replace(/\s+/g, '-')}" >Car Hire {{location.city}}</router-link>
      </div>
      <div class="gap-2 text-sm text-left flex flex-col">
        <a class="hover:underline" href="/ALLRIDEY-vra.pdf" download><i class=" far fa-file-pdf mr-2"></i>Terms and Conditions</a>
        <router-link class="hover:underline" :to="'privacy'" download><i class=" far fa-file-pdf mr-2"></i>Privacy Policy</router-link>
      </div>

    </div>




    <div>
      <a :href="`mailto:` + this.$store.state.email"><i class="far fa-envelope mr-2"></i>{{this.$store.state.email}}</a>
      <p class="text-gray-500 text-xs self-end">© Allridey Pty Ltd | ACN:
        652772980</p>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    computed: {
      locations() {
        return this.$store.state.locations
      }
    }
  }
</script>

<style>

</style>