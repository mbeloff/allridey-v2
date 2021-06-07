import { createWebHistory, createRouter } from "vue-router";
import Splash from './components/Splash.vue'
import Search from './components/Search.vue'
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Splash },
  { name: "Search", path: "/search", component: Search }
];

const router = createRouter({ history, routes });

export default router;