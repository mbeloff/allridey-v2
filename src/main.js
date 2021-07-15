import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { DatePicker } from 'v-calendar';
import store from "./store";

createApp(App).use(router).use(store).component('DatePicker', DatePicker).mount('#app')