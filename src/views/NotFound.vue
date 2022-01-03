<template>
  <div class="h-full w-full grid place-items-center bg-gradient-to-b from-blue-50">
    <div class="text-left">
      <p class="text-7xl text-gray-400 opacity-20 font-black">404</p>
      <p class="text-2xl text-gray-400 font-black mb-4">Page Not Found</p>
      <router-link :to="{ path: '/' }" class="text-blue-600 hover:underline">return home <i class="far fa-home"></i></router-link>
    </div>
    
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>