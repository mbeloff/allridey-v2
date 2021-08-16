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
      <p class="text-xl mt-4 mb-4">Car and camper rentals with {{locationcount}} locations across Australia and New Zealand</p>      
    </div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-10 md:gap-10">
  <div v-for="(article, index) in articles" :key="index" class="w-full text-left rounded" :class=" 'md:col-span-' + article.cols ">
    <div class="bg-white rounded shadow-lg group">
       <div class="h-48 rounded-t bg-cover bg-bottom relative" :style="{'background-image' : 'url(' + article.img + ')'}">
         <div class="absolute opacity-50 group-hover:opacity-100 transition ease-out bg-gradient-to-r h-full w-full rounded-t" :class="'from-' + article.color + '-400'">           
         </div>
         <div class="absolute h-full">
           <p v-html="article.overlaytext" class="pl-2 pt-2 text-4xl md:text-6xl font-bold italic text-white" v-if="article.overlaytext"></p>
           <img v-if="article.overlayimg" class="h-full object-scale-down object-bottom" :src="article.overlayimg" alt="">
          </div>
      </div>
    <div class="rounded-b p-2 flex flex-col gap-2">
      <p class="font-bold">{{article.title}}</p>
      <p class="text-sm">{{article.content}}</p>
      <a class="text-sm text-blue-800 cursor-pointer group">Learn More <i class="far fa-chevron-right transition ease-out duration-500 transform group-hover:translate-x-1"></i></a>
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
    data() {
      return {       
        articles: [
          {
            title: "Car rental. Simplified",
          content: "Get an instant quote and quickly book online in locations right across Australia and New Zealand.",
          img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/v1628040145/allridey/ajddSjc.jpg",
          cols: "3",
          linksto: "Deals",
          overlaytext: 'bookings <br> in a flash <i class="fas fa-bolt"></i>',
          color: 'blue'
          },
          {
            title: "Our fleet",
          content: "We have a range of economical small and mid-size cars, as well as campervans so you can plan your dream roadtrip and save money on accomodation along the way.",
          img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/v1627347849/allridey/jbkad.jpg",
          cols: "2",
          linksto: "Fleet",
          color: 'yellow',
          overlayimg: 'https://res.cloudinary.com/dg5ybbkbh/image/upload/c_scale,w_500/v1582172582/allridey/header2.png'
          },
          {
            title: "Roadside Assist",
          content: "We're only a phone call away with 24 hour roadside assist included on all hires.",
          img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/v1627348031/allridey/Kdbad2.jpg",
          cols: "1",
          overlaytext: '<i class="fal fa-user-headset tranform rotate-3"></i>',
          linksto: "Locations",
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