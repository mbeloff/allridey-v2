<template>
  <div @mouseover="hover=true" @mouseleave="hover=false" class="relative">
    <router-link :to="{name: firstlabel}" class="">{{firstlabel}}</router-link>
    <transition name="dropdown">
      <div  @mouseover="hover=true" @mouseleave="hover=false" v-if="hover" class="absolute -left-0 text-left bg-white shadow-2xl">
      <router-link :to="{ name: label, params: { name: convert(item[itemlabel]), id: item.id } }" class="px-5 py-1 block hover:bg-gray-200 font-normal" v-for="(item, i) in items" :key="item.id">{{item[itemlabel]}}</router-link>
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

<style>
.dropdown-enter-from {
  transform: translateY(1rem);
  opacity: 0;
}
.dropdown-enter-active {
  transition: transform 0.1s ease-in-out, opacity .15s ease-in-out;
}
.dropdown-enter-to {
  opacity: 1;
  transform: translateY(0rem);
}

.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0rem);
}
.dropdown-leave-active {
  transition: transform 0.1s ease-in-out, opacity .15s ease-in-out;
}
.dropdown-leave-to {
  transform: translateY(1rem);
  opacity: 0;
}
 


 



</style>