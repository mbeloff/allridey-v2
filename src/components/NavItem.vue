<template>
  <div @mouseover="hover=true" @mouseleave="hover=false" class="relative">
    <router-link :to="{name: firstlabel}" class="">{{firstlabel}}</router-link>
    <transition name="dropdown">
      <div  @mouseover="hover=true" @mouseleave="hover=false" v-if="hover" class="absolute left-1/2 mt-2 text-left shadow-2xl rounded center-x bg-white font-normal">
      <router-link :class="{ 'dropdown-label' : !item.id, 'dropdown-item' : item.id }" :to="{ name: label, params: { name: convert(item[itemlabel]), id: item.id } }" class="hover:bg-gray-200 hover:border-blue-800 hover:pl-6 hover:pr-4 block whitespace-nowrap" v-for="(item, i) in items" :key="item.id">{{item[itemlabel]}}</router-link>
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
      itemlabel: String
    },
    data() {
      return {
        hover: false
      }
    },
    watch: {
      $route (to, from){
        this.hover = false;                
      }
    },
    methods: {
      convert(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
      }
    }
  }
</script>

<style lang="postcss">
@layer components {
    .dropdown-label {
      @apply px-5 py-1 pointer-events-none  font-bold text-sm bg-blue-700 text-white
    }

    .dropdown-item {
      @apply px-5 py-1  border-l-2 border-white  transition-spacing
    }
}

.center-x {
  transform: translate(-50%, 0rem)
}
.dropdown-enter-from {
  transform: translate(-50%, 0.15rem);
  opacity: 0;
}
.dropdown-enter-active {
  transition: transform 0.25s ease-in-out, opacity .15s ease-in-out;
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
  transition: transform 0.25s ease-in-out, opacity .3s ease-in-out;
}
.dropdown-leave-to {
  transform: translate(-50%, 0.15rem);
  opacity: 0;
}
</style>