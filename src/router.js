import { createWebHistory, createRouter } from "vue-router";
import Splash from './views/Splash.vue'
import Search from './views/Search.vue'
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Splash },
  { name: "Search", path: "/search", component: Search, props: true }
];

const router = createRouter({ history, routes });

export default router;