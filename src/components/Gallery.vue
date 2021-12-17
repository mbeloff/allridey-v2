<template>
  <div ref="container" class="keen-slider text-blue-500 bg-blue-500 h-full w-full rounded">
    <div v-for="(image,index) in slides" :key="index" class="keen-slider__slide" :class="'number-slide' + (index+1)">
      <img class="h-full object-cover" :src="image" />
    </div>

      <div v-if="slides.length > 1" class="dots absolute w-full bottom-0">
          <button
        v-for="(_slide, idx) in dotHelper"
        @click="slider.moveToIdx(idx)"
        :class="{ dot: true, active: current === idx }"
        :key="idx"
      ></button>      
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
    const [container, slider] = useKeenSlider(
      {
        initial: current.value,
        slideChanged: (s) => {
          current.value = s.track.details.rel
        },
      },
      [
        (slider) => {
          let timeout
          let mouseOver = false
          function clearNextTimeout() {
            clearTimeout(timeout)
          }
          function nextTimeout() {
            clearTimeout(timeout)
            if (mouseOver) return
            timeout = setTimeout(() => {
              slider.moveToIdx(0, true)
            }, 3000)
          }
          slider.on("created", () => {
            slider.container.addEventListener("mouseover", () => {
              mouseOver = true
              clearNextTimeout()
            })
            slider.container.addEventListener("mouseout", () => {
              mouseOver = false
              nextTimeout()
            })
            nextTimeout()
          })
          slider.on("dragStarted", clearNextTimeout)
          slider.on("animationEnded", nextTimeout)
          slider.on("updated", nextTimeout)
        },
      ]
    )
    const dotHelper = computed(() => slider.value ? [...Array(slider.value.track.details.slides.length).keys()] : [])
    return { container, current, dotHelper, slider }
  },
    props: {
      slides: Array
    },
  }
</script>

<style>

  [class^="number-slide"],
  [class*=" number-slide"] {
    background: rgb(237, 237, 238);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50px;
    color: #fff;
    font-weight: 500;
    min-width: 100% !important;
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