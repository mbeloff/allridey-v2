<template>
  <div
    class="bg-white rounded opacity-90 shadow-xl shadow-green-800/30 w-full grid grid-flow-row sm:grid-flow-col sm:divide-x divide-y sm:divide-y-0 divide-gray-300 border border-gray-300 text-xs sm:text-sm"
  >
    <p
      class="py-1.5 sm:py-6 sm:rounded-l"
      :class="(btnStyle(1, stage), btnDisable(1, stage))"
    >
      <i class="" :class="iStatus(1, stage)"></i> Search
    </p>
    <p
      class="py-1.5 sm:py-6"
      :class="(btnStyle(2, stage), btnDisable(2, stage))"
    >
      <i class="" :class="iStatus(2, stage)"></i> Select
    </p>
    <p
      class="py-1.5 sm:py-6"
      :class="(btnStyle(3, stage), btnDisable(3, stage))"
    >
      <i class="" :class="iStatus(3, stage)"></i> Extras
    </p>
    <p
      class="py-1.5 sm:py-6"
      :class="(btnStyle(4, stage), btnDisable(4, stage))"
    >
      <i class="" :class="iStatus(4, stage)"></i> Pay
    </p>
    <p
      class="py-1.5 sm:py-6 sm:rounded-r"
      :class="(btnStyle(5, stage), btnDisable(5, stage))"
    >
      <i class="" :class="iStatus(5, stage)"></i> Summary
    </p>
  </div>
</template>

<script>
export default {
  props: {
    stage: Number,
  },
  methods: {
    iStatus(step, stage) {
      if (step == stage && stage != 5) {
        return 'text-gray-500 fal fa-circle'
      } else if (step < stage || (step == 5 && stage == 5)) {
        return 'text-green-500 fal fa-check-circle'
      } else {
        return 'invisible fal fa-check-circle'
      }
    },
    btnStyle(step, stage) {
      if ((step == 4 || step == 3 || step == 2) && stage == 5) {
        return 'bg-gray-200 disabled hidden'
      }
      if (step == stage) {
        return 'active'
      } else if (step < stage) {
        return 'completed'
      } else {
        return 'bg-gray-200 disabled'
      }
    },
    btnDisable(step, stage) {
      if (step > 1 && step < stage) {
        return 'disabled text-gray-400'
      } else if (step > stage) {
        return 'disabled text-gray-400'
      } else if ((step == 5 && stage == 5) || step == stage) {
        return 'disabled text-gray-600'
      } else {
        return 'text-gray-500'
      }
    },
  },
}
</script>
<style lang="postcss">
.disabled {
  pointer-events: none;
}

.completed {
  @apply bg-gray-200;
}
.active {
  @apply bg-white;
}
</style>
