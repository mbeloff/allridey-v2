<template>
  <div class="grid grid-flow-col place-items-center gap-2 mt-10">
    <button @click="setMode('quote')" class="bg-green-500 px-4 py-1 ml-auto">Email Quote</button>
    <button @click="setMode('book')" class="bg-green-500 px-4 py-1 mr-auto">Make Book</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mode: null
    }
  }, 
  methods: {
    setMode(mode) {
      this.mode = mode
    }
  }
}
</script>

<style>

</style>