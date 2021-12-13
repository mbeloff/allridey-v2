<template>
<div class="navigation-wrapper ">
  <div ref="container" class="keen-slider text-blue-500 bg-blue-500 h-full">
    <div v-for="(image,index) in slides" :key="index" class="keen-slider__slide" :class="'number-slide' + (index+1)">
      <img class="h-full w-full object-cover" :src="image" />
    </div>
    <!-- <svg
        @click="slider.prev()"
        :class="{
          arrow: true,
          'arrow--left': true,
          'arrow--disabled': current === 0,
          'hidden': slides.length < 2
          }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class=""
      >
        <path
        fill="skyblue" d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"
        ></path>
      </svg>
      <svg
        v-if="slider"
        @click="slider.next()"
        :class="{
          arrow: true,
          'arrow--right': true,
          'arrow--disabled': current === slider.track.details.slides.length - 1,
          'hidden': slides.length < 2
        }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
        fill="skyblue" d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"></path>
      </svg> -->
      <div v-if="slides.length > 1" class="dots absolute w-full bottom-0">
          <button
        v-for="(_slide, idx) in dotHelper"
        @click="slider.moveToIdx(idx)"
        :class="{ dot: true, active: current === idx }"
        :key="idx"
      ></button>      
    </div>
  </div>
</div>
  
</template>

<script>
import { computed, ref } from 'vue'
  import {
    useKeenSlider
  } from 'keen-slider/vue.es'
  import 'keen-slider/keen-slider.min.css'


  export default {
    setup(){

    const current = ref(0)
    const [container, slider] = useKeenSlider({
      initial: current.value,
      slideChanged: (s) => {
        current.value = s.track.details.rel
      },
    })

    const dotHelper = computed(() => slider.value ? [...Array(slider.value.track.details.slides.length).keys()] : [])
    console.log(slider)
    return { container, current, dotHelper, slider }
  },
    props: {
      slides: Array
    },
  }
</script>

<style>
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  [class^="number-slide"],
  [class*=" number-slide"] {
    background: rgb(237, 237, 238);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    color: #fff;
    font-weight: 500;
  }
  .navigation-wrapper {
  position: relative;
}
.arrow {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  fill: #fff;
  cursor: pointer;
}
.arrow--left {
  left: 5px;
}
.arrow--right {
  left: auto;
  right: 5px;
}
.arrow--disabled {
  fill: rgba(255, 255, 255, 0.5);
}
.dots {
  display: flex;
  padding: 5px 0;
  justify-content: center;
}
.dot {
  border: none;
  width: 5px;
  height: 5px;
  background: #00000056;
  border-radius: 50%;
  margin: 0 5px;
  padding: 5px;
  cursor: pointer;
}
.dot:focus {
  outline: none;
}
.dot.active {
  background: rgb(58, 183, 255);
}
</style>