import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { DatePicker } from 'v-calendar';

createApp(App).use(router).component('DatePicker', DatePicker).mount('#app')