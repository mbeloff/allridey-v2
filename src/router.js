import { createWebHistory, createRouter } from "vue-router";
// import Home from './views/Home.vue'
import Search from './views/Search.vue'
import CheckPayment from './views/CheckPayment.vue'
const history = createWebHistory();

const routes = [
  { name: "Home", path: "/", component: Search, props: true },
  { name: "CheckPayment", path: "/checkpayment", component: CheckPayment, props: true },
];

const router = createRouter({ history, routes });

export default router;