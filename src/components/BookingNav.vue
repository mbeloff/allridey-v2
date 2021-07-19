<template>
  <div class="bg-white rounded bg-opacity-90 shadow-xl w-full grid grid-flow-row sm:grid-flow-col sm:divide-x mb-10 divide-y sm:divide-y-0 divide-gray-300 border border-gray-300">
    <button @click="changeStep(1), this.$router.push({name: 'Search'})" class="py-1.5 sm:py-6 sm:rounded-l" :class="btnStatus(1)">
      <i class="" :class="iStatus(1)"></i> Search
    </button>
    <button @click="changeStep(2), this.$router.push({name: 'Results'})" class="py-1.5 sm:py-6" :class="btnStatus(2)">
      <i class="" :class="iStatus(2)"></i> Select
    </button>
    <button @click="changeStep(3), this.$router.push({name: 'Vehicle'})" class="py-1.5 sm:py-6" :class="btnStatus(3)">
      <i class="" :class="iStatus(3)"></i> Extras
    </button>
    <button @click="changeStep(4), this.$router.push({name: 'Payment'})" class="py-1.5 sm:py-6" :class="btnStatus(4)">
      <i class="" :class="iStatus(4)"></i> Pay
    </button>
    <button @click="changeStep(5), this.$router.push({name: 'Summary'})" class="py-1.5 sm:py-6 sm:rounded-r" :class="btnStatus(5)">
      <i class="" :class="iStatus(5)"></i> Summary
    </button>
  </div>
</template>

<script>
export default {
  props: {
    status: Number
  },
  methods: {
    changeStep(num) {
      this.$emit("changeStep", num)
    },
    iStatus(step) {
      if (step == this.status ) {
        return "text-gray-500 fal fa-circle"
      } else if (step < this.status) {
        return 'text-green-500 fas fa-check-circle'
      } else {
        return 'invisible fas fa-check-circle'
      }
    },
    btnStatus(step) {
      if ((step == 4 || step == 3) && this.status == 5) {
        return 'bg-gray-200 text-gray-400 disabled hidden'
      }
      if (step == this.status ) {
        return "active"
      } else if (step < this.status) {
        return 'completed'
      } else {
        return 'bg-gray-200 text-gray-400 disabled'
      }
    }
  }
}
</script>
<style lang="postcss">
.disabled {
  pointer-events: none
}
@layer components {
    .completed {
      @apply bg-gray-200 text-current
    }
    .active {
      @apply bg-white
    }
}
</style>