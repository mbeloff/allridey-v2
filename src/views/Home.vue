<template>
  <div class="w-full h-full grid place-items-center bg-gray-300">
    <div>
      
      <h1 class="text-6xl mb-1 mt-8">Allridey</h1>
      <span class="">
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
      </span>
      <p class="text-xl mt-4 mb-4">Cheap car and camper rentals across Australia and New Zealand</p>

      <div class="relative">
        <booking-form class=""></booking-form>
        <img class="max-w-screen-lg w-screen" src="https://res.cloudinary.com/dg5ybbkbh/image/upload/c_fit,h_350/f_auto,q_auto/v1582172582/allridey/header2.png" alt="">
      </div>
      
    </div>
  </div>
</template>

<script>
import BookingForm from '../components/BookingForm.vue'
  export default {
    components: {BookingForm},
    data() {
      return {
      }
    },
    computed: {
    },
    mounted() {
    },
    methods: {
    },
  }
</script>

<style>

</style>