import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { DatePicker } from 'v-calendar';
import store from "./store";
import { plugin as VueTippy } from 'vue-tippy'
import 'tippy.js/dist/backdrop.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/dist/tippy.css'
import VueGtag from "vue-gtag-next";

createApp(App).use(router).use(store).use(VueGtag, {
  property: {
    id: "G-3DHLGGKJJR"
  },
}).use(
  VueTippy,
  {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>
    defaultProps: { placement: 'left',
    animateFill: true,
    arrow: true, 
    trigger: 'mouseenter click',},
  }
).component('DatePicker', DatePicker).mount('#app')