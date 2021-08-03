<template>
  <div @mouseover="hover=true" @mouseleave="hover=false" class="">
    <router-link :to="{name: firstlabel}" class="">{{firstlabel}}</router-link>
    <div :class="{'hidden mt-10': !hover}" @mouseover="hover=true" @mouseleave="hover=false" v-if="this.items" class="absolute top-full -left-0 text-left bg-white shadow-2xl">
      <router-link :to="{ name: label, params: { name: convert(item[itemlabel]), id: item.id } }" class="px-5 py-1 block hover:bg-gray-200 font-normal" v-for="(item, i) in items" :key="item.id">{{item[itemlabel]}}</router-link>
    </div>
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

</style>