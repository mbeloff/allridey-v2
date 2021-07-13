import { createWebHistory, createRouter } from "vue-router";
import Home from './views/Home.vue'
import Search from './views/Search.vue'
import Success from './views/Success.vue'
// import Payinfo from './views/Payinfo.vue'
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Search, props: true },
  { name: "Search", path: "/search", component: Search, props: true },
  // { name: "Search", path: "/pay", component: Search, props: true },
  { name: "Success", path: "/success", component: Success, props: true },
];

const router = createRouter({ history, routes });

export default router;