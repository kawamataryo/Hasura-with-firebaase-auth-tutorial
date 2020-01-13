import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import { auth } from "@/plugins/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: { requireAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, _from, next) => {
  const requireAuth = to.matched.some(record => record.meta.requireAuth);
  const currentUser = auth.currentUser;

  if (!requireAuth || currentUser) {
    next();
    return;
  }

  next({
    path: "/login",
    query: { redirect: to.fullPath }
  });
});

export default router;
