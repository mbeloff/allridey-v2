import { createWebHistory, createRouter } from "vue-router";
import Search from './views/Search.vue'
import Locations from './views/LocationList.vue'
import Location from './views/Location.vue'
import Checkin from './views/Checkin.vue'
import ModifyBooking from './views/ModifyBooking.vue'
import Privacy from './views/Privacy.vue'
import NotFound from './views/NotFound.vue'
import Contact from './views/Contact.vue'
import { trackRouter } from "vue-gtag-next"
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Search },
  { name: "Search", path: "/search/:loc?", component: Search, props: true },
  { name: "Results", path: "/results", component: Search},
  { name: "Contact", path: "/contact", component: Contact},
  { name: "Options", path: "/options", component: Search},
  { name: "Payment", path: "/payment", component: Search},
  { name: "Summary", path: "/summary", component: Search},
  {name: "Locations", path: "/locations", component: Locations},
  {name: "Location", path: "/location/:name?", component: Location, props: true},
  {name: "Checkin", path: "/checkin", component: Checkin},
  {name: "ModifyBooking", path: "/modifybooking", component: ModifyBooking},
  {name: "Privacy", path: "/privacy", component: Privacy},
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