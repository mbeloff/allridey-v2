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
      <!-- <router-link :to="{ name: 'Search' }" class="px-6 py-2 bg-blue-500 hover:bg-yellow-500 text-white rounded m-12 text-xl"><i class="fal fa-search"></i> BOOK NOW </router-link> -->

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
        // step1: {},
        // loading: true,
      }
    },
    computed: {
    },
    mounted() {
        // var step1 = JSON.stringify({'method':'step1'})
        // this.apiCall(step1)
    },
    methods: {
      // async signRequest(payload) {
      //   let signString = await fetch("http://localhost:3000/signRequest.php", {
      //     method: 'POST',
      //     headers: {"content-Type": "text/plain"},
      //     body: payload,
      //   })
      //   .then(response => response.text())
      //   .then(data => {
      //       return JSON.parse(data).signature;
      //   })
      //   // console.log(signString)
      //   return signString
      // },

      // async apiCall(payload) {
      //   let signString = await this.signRequest(payload);
      //   let formdata = new FormData();
      //   formdata.append("request", payload);
      //   formdata.append("signature", signString );
      //   let responseData = await fetch("https://apis.rentalcarmanager.com/booking/v3.2?apikey=QXVBbGxSaWRleTUzNFt1bmRlZmluZWRdfE1pY2hhZWxXaWNrZWR8ZXVucGNGdEI=", {
      //       method: "POST",
      //       body: formdata,
      //     })
      //     .then(response => response.text())
      //     .then(result => {
      //       return JSON.parse(result)
      //     })
      //     // console.log(responseData)
      //     this.step1 = responseData.results
      //     this.loading = false
      // }
    },
  }
</script>

<style>

</style>