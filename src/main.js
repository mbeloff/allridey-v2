import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './router'
import { DatePicker } from 'v-calendar'
import store from './store'
import { plugin as VueTippy } from 'vue-tippy'
import 'tippy.js/dist/backdrop.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/dist/tippy.css'
import VueGtag from 'vue-gtag-next'
import { createHead } from '@vueuse/head'

const head = createHead()
createApp(App)
  .use(head)
  .use(router)
  .use(store)
  .use(VueGtag, {
    // isEnabled: import.meta.env.PROD,
    property: [
      {
        id: 'G-3DHLGGKJJR',
        default: true,
      },
      {
        id: import.meta.env.VITE_NZ_TAG_BUDI,
      },
      {
        id: import.meta.env.VITE_AU_TAG_BUDI,
      },
    ],
  })
  .use(VueTippy, {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>
    defaultProps: {
      placement: 'left',
      animateFill: true,
      arrow: true,
      trigger: 'mouseenter click',
    },
  })

  .component('DatePicker', DatePicker)
  .mount('#app')
