<template>
  <carousel :setting="settings" class="">
        <slide v-for="slide in images" :key="slide" class="carousel__item">
          <div class="h-full bg-cover" :style="{ backgroundImage: 'url('+slide+')'}"></div>
        </slide>
        <template #addons>
          <navigation />
        </template>
  </carousel>
</template>

<script>
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
export default {
  props: {
    // images: Array
  },
  components: {
    Carousel,
    Slide,
    Navigation,
  },
  data() {
    return {
      images: ["https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978217/allridey/vehicles/6/8.jpg","https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978216/allridey/vehicles/6/7.jpg","https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978218/allridey/vehicles/6/6.jpg","https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978218/allridey/vehicles/6/2.jpg","https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978217/allridey/vehicles/6/15.jpg","https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978219/allridey/vehicles/6/13.jpg","https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978217/allridey/vehicles/6/12.jpg","https://res.cloudinary.com/dg5ybbkbh/image/upload/v1632978221/allridey/vehicles/6/11.jpg"],
      setting: {
         itemsToShow: 1,
          snapAlign: 'center',
      }
    }
  }
}
</script>

<style>
.carousel__viewport, .carousel__track {
  height: 100%;
}
.carousel__slide {
  width: 100%;
}
  .carousel__item {
  min-height: 200px;
  height: 100%;
  width: 100%;
  background-color: var(--carousel-color-primary);
  color:  var(--carousel-color-white);
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>