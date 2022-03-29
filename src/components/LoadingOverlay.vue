<template>
  <div
    class="absolute w-full h-full top-0 left-0 rounded grid place-items-center bg-gray-200 bg-opacity-80 z-50"
  >
    <spinner></spinner>
  </div>
</template>

<script>
import Spinner from './SpinnerIcon.vue'
export default {
  components: { Spinner },
}
</script>

<style></style>
