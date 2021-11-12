import { createWebHistory, createRouter } from "vue-router";
import Search from './views/Search.vue'
import CheckPayment from './views/CheckPayment.vue'
import Locations from './views/Locations.vue'
import Location from './views/Location.vue'
import Checkin from './views/Checkin.vue'
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Search, props: true },
  { name: "Search", path: "/search", component: Search, props: true },
  { name: "Results", path: "/results", component: Search, props: true},
  { name: "Vehicle", path: "/vehicle", component: Search, props: true},
  { name: "Payment", path: "/payment", component: Search, props: true},
  { name: "Summary", path: "/summary", component: Search, props: true},
  { name: "CheckPayment", path: "/checkpayment", component: CheckPayment, props: true },
  {name: "Locations", path: "/locations", component: Locations, props: true},
  {name: "Location", path: "/location/:name?", component: Location, props: true},
  {name: "Checkin", path: "/checkin", component: Checkin, props: true},

];

const router = createRouter({ history, routes });

export default router;