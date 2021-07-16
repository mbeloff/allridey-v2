<template>
  <div class="absolute w-full h-full top-0 left-0 rounded grid place-items-center bg-gray-200 bg-opacity-80 no-pointer">
    <spinner></spinner>
  </div>
</template>

<script>
import Spinner from './Spinner.vue'
export default {
  components: {Spinner}
}
</script>

<style>
.no-pointer {
  pointer-events: none
}
</style>