import { createWebHistory, createRouter } from 'vue-router'
import Search from './views/MainSearchPage.vue'

import Locations from './views/LocationList.vue'
import Location from './views/LocationDetails.vue'
import Checkout from './views/StripeCheckout.vue'
import Privacy from './views/PrivacyPolicy.vue'
import NotFound from './views/NotFound.vue'
import Contact from './views/ContactPage.vue'
import PriceBeat from './views/PriceBeat.vue'
import { trackRouter } from 'vue-gtag-next'
const history = createWebHistory()

const routes = [
  { name: 'Home', path: '/', component: Search },
  { name: 'Search', path: '/search/:loc?', component: Search, props: true },
  { name: 'Results', path: '/results', component: Search },
  { name: 'Contact', path: '/contact', component: Contact },
  { name: 'Options', path: '/options', component: Search },
  { name: 'Payment', path: '/payment', component: Search },
  { name: 'Checkout', path: '/checkout', component: Checkout },
  { name: 'Summary', path: '/summary', component: Search },
  { name: 'PriceBeat', path: '/offers/price-beat', component: PriceBeat },
  { name: 'Locations', path: '/locations', component: Locations },
  {
    name: 'Location',
    path: '/location/:name?',
    component: Location,
    props: true,
  },
  { name: 'Privacy', path: '/privacy', component: Privacy },
  { path: '/australia', redirect: '/' },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({ history, routes })
trackRouter(router)

export default router
