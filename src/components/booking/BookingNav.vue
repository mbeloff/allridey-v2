<template>
  <div class="bg-white rounded opacity-90 shadow-xl shadow-green-800/30 w-full grid grid-flow-row sm:grid-flow-col sm:divide-x divide-y sm:divide-y-0 divide-gray-300 border border-gray-300 text-xs sm:text-sm">
    <p class="py-1.5 sm:py-6 sm:rounded-l" :class="btnStyle(1, this.status), btnDisable(1, this.status)">
      <i class="" :class="iStatus(1, this.status)"></i> Search
    </p>
    <p class="py-1.5 sm:py-6" :class="btnStyle(2, this.status), btnDisable(2, this.status)">
      <i class="" :class="iStatus(2, this.status)"></i> Select
    </p>
    <p class="py-1.5 sm:py-6" :class="btnStyle(3, this.status), btnDisable(3, this.status)">
      <i class="" :class="iStatus(3, this.status)"></i> Extras
    </p>
    <p class="py-1.5 sm:py-6" :class="btnStyle(4, this.status), btnDisable(4, this.status)">
      <i class="" :class="iStatus(4, this.status)"></i> Pay
    </p>
    <p class="py-1.5 sm:py-6 sm:rounded-r" :class="btnStyle(5, this.status), btnDisable(5, this.status)">
      <i class="" :class="iStatus(5, this.status)"></i> Summary
    </p>
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
    iStatus(step, status) {
      if (step == status && status != 5) {
        return "text-gray-500 fal fa-circle"
      } else if (step < status || step == 5 && status == 5) {
        return 'text-green-500 fas fa-check-circle'
      } else {
        return 'invisible fas fa-check-circle'
      }
    },
    btnStyle(step, status) {
      if ((step == 4 || step == 3 || step == 2) && status == 5) {
        return 'bg-gray-200 disabled hidden'
      }
      if (step == status) {
        return "active"
      } else if (step < status) {
        return 'completed'
      } else {
        return 'bg-gray-200 disabled'
      }
    },
    btnDisable(step, status) {
      if (step > 1 && step < status) {
        return 'disabled text-gray-400'
      } else if (step > status) {
        return 'disabled text-gray-400'
      } else if (step == 5 && status == 5 || step == status) {
        return 'disabled text-gray-600'
      } else {
        return 'text-gray-500'
      }
    }
  }
}
</script>
<style lang="postcss">
.disabled {
  pointer-events: none
}

  .completed {
    @apply bg-gray-200
  }
  .active {
    @apply bg-white
  }

</style>