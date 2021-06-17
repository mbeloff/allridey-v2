import { createWebHistory, createRouter } from "vue-router";
import Home from './views/Home.vue'
import Search from './views/Search.vue'
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Home },
  { name: "Search", path: "/search", component: Search, props: true }
];

const router = createRouter({ history, routes });

export default router;