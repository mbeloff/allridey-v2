<template>
  <div class="relative" @mouseover="hover = true" @mouseleave="hover = false">
    <router-link :to="{ name: firstlabel }" class="">{{
      firstlabel
    }}</router-link>
    <transition name="dropdown">
      <div
        v-if="hover"
        class="absolute font-normal text-left left-1/2 center-x"
      >
        <div class="h-4"></div>
        <div
          class="relative text-blue-900 rounded shadow-2xl dropdown-container"
        >
          <router-link
            v-for="item in items"
            :key="item.id"
            :class="{ 'dropdown-label': !item.id, 'dropdown-item': item.id }"
            :to="{
              name: label,
              params: {
                name: item[itemlabel].replaceAll(' ', '-').toLowerCase(),
                id: item.id,
              },
            }"
            class="block hover:bg-gray-200 whitespace-nowrap first:rounded-t last:rounded-b"
            >{{ item[itemlabel] }}</router-link
          >
        </div>
        <!-- 
        hover animation for router link
        hover:pl-5 hover:pr-3
       -->
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    firstlabel: String,
    label: String,
    items: Array,
    itemlabel: String,
  },
  data() {
    return {
      hover: false,
    }
  },
  watch: {
    $route() {
      this.hover = false
    },
  },
}
</script>

<style lang="postcss">
.dropdown-label {
  @apply px-10 py-3 pointer-events-none font-bold text-sm bg-blue-900 text-gray-200;
}

.dropdown-item {
  @apply px-8 py-3 border-white transition-spacing bg-white;
}

.dropdown-container:after {
  margin-bottom: -1px;
  bottom: 100%;
  left: 50%;
  border: solid transparent;
  content: '';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-color: transparent;
  border-bottom-color: #0c4a6e;
  border-width: 11px;
  margin-left: -11px;
}

.center-x {
  transform: translate(-50%, 0rem);
}
.dropdown-enter-from {
  transform: translate(-50%, 0.15rem);
  opacity: 0;
}
.dropdown-enter-active {
  transition: transform 0.25s ease-in-out, opacity 0.15s ease-in-out;
}
.dropdown-enter-to {
  opacity: 1;
  transform: translate(-50%, 0rem);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translate(-50%, 0rem);
}
.dropdown-leave-active {
  transition: transform 0.25s ease-in-out, opacity 0.3s ease-in-out;
}
.dropdown-leave-to {
  transform: translate(-50%, 0.15rem);
  opacity: 0;
}
</style>
