import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 课程模块
import courseRoutes from "./modules/course";
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/course",
    name: "Course",
    component: { render: (h) => h("router-view") },
    meta: { title: "课程管理" },
    children: courseRoutes,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
