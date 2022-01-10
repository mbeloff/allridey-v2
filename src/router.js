import { createWebHistory, createRouter } from "vue-router";
import Search from './views/Search.vue'
import CheckPayment from './views/CheckPayment.vue'
import Locations from './views/LocationList.vue'
import Location from './views/Location.vue'
import Checkin from './views/Checkin.vue'
import ModifyBooking from './views/ModifyBooking.vue'
import Privacy from './views/Privacy.vue'
import NotFound from './views/NotFound.vue'
import { trackRouter } from "vue-gtag-next"
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Search, props: true },
  { name: "Search", path: "/search/:loc?", component: Search, props: true },
  { name: "Results", path: "/results", component: Search, props: true},
  { name: "Options", path: "/options", component: Search, props: true},
  { name: "Payment", path: "/payment", component: Search, props: true},
  { name: "Summary", path: "/summary", component: Search, props: true},
  { name: "CheckPayment", path: "/checkpayment", component: CheckPayment, props: true },
  {name: "Locations", path: "/locations", component: Locations, props: true},
  {name: "Location", path: "/location/:name?", component: Location, props: true},
  {name: "Checkin", path: "/checkin", component: Checkin, props: true},
  {name: "ModifyBooking", path: "/modifybooking", component: ModifyBooking, props: true},
  {name: "Privacy", path: "/privacy", component: Privacy, props: true},
  {path: '/australia', redirect: "/"},
  {
    path:"/404",
    name: "NotFound",
    component: NotFound
  },
  {
    path:'/:pathMatch(.*)*',
    redirect: "/404"
  },
];

const router = createRouter({ history, routes });
trackRouter(router);

export default router;