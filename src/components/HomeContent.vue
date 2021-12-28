<template>
  <div class="p-10 text-center">
    <div class="w-full h-full grid place-items-center">
      <h1 class="text-6xl mt-8 mb-3">Allridey</h1>
      <span class="">
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
        <i class="fas fa-star text-yellow-400"></i>
      </span>
      <!-- <p class="text-xl mt-4 mb-4">Find cars and campervans in <span v-if="locationcount > 0">{{locationcount}}</span> locations across Australia and New Zealand</p> -->
      <p class="text-xl mt-4 mb-4">Car Rental</p>
      <p>Allridey offers great value car and van rentals in Hobart. We've got the best prices - get an instant quote and book online today.</p>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-10 md:gap-10">
  <div v-for="(article, index) in articles" :key="index" class="w-full text-left rounded" :class="'md:col-span-' + article.cols">
    <div class="bg-white rounded shadow-lg group">
       <div class="h-48 rounded-t bg-cover bg-bottom relative" :style="{'background-image' : 'url(' + article.img + ')'}">
         <div class="absolute opacity-50 group-hover:opacity-100 transition ease-out bg-gradient-to-r h-full w-full rounded-t transtiion-colors" :class="'from-' + article.color + '-400'">           
         </div>
         <div class="absolute h-full w-full">
           <p v-html="article.overlaytext" class="pl-2 pt-2 text-4xl md:text-6xl font-bold italic text-white" v-if="article.overlaytext"></p>
           <img v-if="article.overlayimg" class="h-full w-full object-scale-down" :src="article.overlayimg" alt="">
          </div>
      </div>
    <div class="rounded-b p-2 flex flex-col gap-2">
      <p class="font-bold">{{article.title}}</p>
      <p class="text-sm">{{article.content}}</p>
      <router-link v-if="article.linksto" :to="{name: article.linksto }" @click="scroll(article.scroll)" class="text-sm text-blue-800 cursor-pointer group">{{article.linktext}} <i class="far fa-chevron-right transition ease-out duration-500 transform group-hover:translate-x-1"></i></router-link>
    </div>
    </div>   
  </div>
</div>
</template>

<script>
  export default {
    computed: {
      locationcount() {
        return this.$store.state.locations.length
      }
    },
    mounted() {
    },
    methods: { 
      scroll(id) {
        setTimeout(()=>{ document.getElementById(id).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})}, 100);        
      },     
    },
    data() {
      return {
        gallery: [],
        articles: [{
            title: "Car rental. Simple",
            content: "Get an instant quote and quickly book online. Cheap car and van rental in Hobart",
            img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1628040145/allridey/ajddSjc.jpg",
            cols: "3",
            linktext: "Book Now",
            linksto: "Search",
            scroll: "search-form",
            overlaytext: 'bookings <br> in a flash <i class="fas fa-bolt"></i>',
            color: 'blue'
          },
          {
            title: "Our fleet",
            content: "We have a range of economical cars and 8 seat vans at great daily rates. If you find a cheaper price, we'll beat it by 10%.",
            img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1627347849/allridey/jbkad.jpg",
            cols: "2",
            // linksto: "Search",
            color: 'yellow',
            overlayimg: 'https://res.cloudinary.com/allridey/image/upload/c_scale,w_500/q_auto,f_auto/v1640042972/assets/allridey-micra.png'
          },
          {
            title: "Roadside Assist",
            content: "We're only a phone call away with 24 hour support and roadside assist included on all hires.",
            img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/q_auto,f_auto/c_scale,w_700/v1627348031/allridey/Kdbad2.jpg",
            cols: "1",
            overlaytext: '<i class="fal fa-user-headset tranform rotate-3"></i>',
            // linksto: "Search",
            color: 'green'
          },
        ]
      }
    }
  }
</script>

<style lang="postcss">
  .banner1 {
    background-image: url(https://res.cloudinary.com/dg5ybbkbh/image/upload/v1628040145/allridey/ajddSjc.jpg)
  }
</style>