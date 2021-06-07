<template>
  <div class="w-full h-full grid place-items-center">
    <div>
       <h1 class="text-6xl mb-1">Allridey</h1>
    <span class="">
      <i class="fas fa-star text-yellow-400"></i>
      <i class="fas fa-star text-yellow-400"></i>
      <i class="fas fa-star text-yellow-400"></i>
      <i class="fas fa-star text-yellow-400"></i>
      <i class="fas fa-star text-yellow-400"></i>
    </span>
    <p class="text-xl mt-4 mb-4">Cheap car and camper rentals across Australia and New Zealand</p>
      <router-link :to="{ name: 'Search' }" class="px-6 py-2 bg-blue-500 hover:bg-yellow-500 text-white rounded m-12 text-xl"><i class="fal fa-search"></i> Find a Vehicle </router-link>
    
    <img class="max-w-screen-lg w-screen" src="https://res.cloudinary.com/dg5ybbkbh/image/upload/v1582172582/allridey/header2.png" alt="">
    </div>
   
    
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>