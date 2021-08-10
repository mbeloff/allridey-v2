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
      <p class="text-xl mt-4 mb-4">Car and camper rentals with 17 locations across Australia and New Zealand</p>      
    </div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-x-0 gap-y-10 md:gap-10">
  <div v-for="(article, index) in articles" :key="index" class="w-full text-left rounded" :class=" 'md:col-span-' + article.cols ">
    <div class="bg-white rounded shadow-lg">
       <div class="h-48 rounded-t bg-cover bg-bottom relative" :style="{'background-image' : 'url(' + article.img + ')'}">
         <div class="absolute bg-gradient-to-r h-full w-full rounded-t" :class="'from-' + article.color + '-400'">
           <img v-if="article.overlayimg" class="h-full object-scale-down object-bottom" :src="article.overlayimg" alt="">
         </div>
      </div>
    <div class="rounded-b flex flex-wrap p-2 gap-2">
      <p class="font-bold">{{article.title}}</p>
      <p class="text-sm">{{article.content}}</p>
      <button class="btn btn-secondary flex-initial">Learn More</button>
    </div>
    </div>   
  </div>
</div>
</template>

<script>
  export default {
    data() {
      return {
        articles: [
          {
            title: "Sample",
          content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam quis a officiis omnis eos reiciendis quo est doloremque, culpa eius quod, ut non quibusdam.",
          img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/v1628040145/allridey/ajddSjc.jpg",
          cols: "3",
          linksto: "Deals",
          color: 'blue'
          },
          {
            title: "Sample2",
          content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, veniam saepe! Impedit, perferendis laboriosam!",
          img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/v1627347849/allridey/jbkad.jpg",
          cols: "1",
          linksto: "Fleet",
          color: 'yellow',
          overlayimg: 'https://res.cloudinary.com/dg5ybbkbh/image/upload/c_scale,w_500/v1582172582/allridey/header2.png'
          },
          {
            title: "Sample3",
          content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, veniam saepe! Impedit.",
          img: "https://res.cloudinary.com/dg5ybbkbh/image/upload/v1627348031/allridey/Kdbad2.jpg",
          cols: "2",
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