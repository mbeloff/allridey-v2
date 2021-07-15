<template>
  <div @mouseover="hover=true" @mouseleave="hover=false" class="relative">
    <router-link :to="{name: firstlabel}" class="hover:bg-gray-200 px-5 py-1">{{firstlabel}}</router-link>
    <div :class="{'hidden mt-10': !hover}" @mouseover="hover=true" @mouseleave="hover=false" v-if="this.items" class="absolute top-100 -left-0 text-left bg-white shadow-2xl divide-y">
      <router-link :to="{ name: label, params: { name: convert(item[itemlabel]), id: item.id } }" class="px-5 py-1 block hover:bg-gray-200" v-for="(item, i) in items" :key="item.id">{{item[itemlabel]}}</router-link>
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
    methods: {
      convert(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
      }
    }
  }
</script>

<style>

</style>