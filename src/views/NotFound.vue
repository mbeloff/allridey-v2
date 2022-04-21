<template>
  <div
    class="h-full w-full grid place-items-center bg-gradient-to-b from-blue-50"
  >
    <div class="text-left px-2">
      <p class="text-7xl text-gray-400 opacity-20 font-black">404 Not Found</p>
      <p class="text-2xl text-gray-400 font-black mb-4">I think we got lost</p>
      <router-link :to="{ path: '/' }" class="text-blue-600 hover:underline"
        >take me home <i class="fal fa-home"></i
      ></router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
