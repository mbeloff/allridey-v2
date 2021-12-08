<template>
  <div @mouseover="hover=true" @mouseleave="hover=false" class="relative">
    <router-link :to="{name: firstlabel}" class="">{{firstlabel}}</router-link>
    <transition name="dropdown">
      <div v-if="hover" class="absolute left-1/2 text-left  center-x font-normal">
      <div class="h-4"></div>
      <div class="relative rounded dropdown-container shadow-2xl text-blue-900">
        <router-link :class="{ 'dropdown-label' : !item.id, 'dropdown-item' : item.id }" :to="{ name: label, params: { name: convert(item[itemlabel]), id: item.id } }" class="hover:bg-gray-200  block whitespace-nowrap first:rounded-t last:rounded-b" v-for="(item, i) in items" :key="item.id">{{item[itemlabel]}}</router-link>
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
      },
    }
  }
</script>

<style lang="postcss">
@layer components {
    .dropdown-label {
      @apply px-5 py-1.5 pointer-events-none  font-bold text-sm bg-blue-900 text-gray-200
    }

    .dropdown-item {
      @apply px-4 py-1.5 border-white  transition-spacing bg-white
    }
    /* ! rounded first and last item */
    /* /*  */
     /* */
    
}

.dropdown-container:after {
  margin-bottom: -1px;
	bottom: 100%;
	left: 50%;
	border: solid transparent;
	content: "";
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