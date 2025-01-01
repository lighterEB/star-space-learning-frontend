import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 系统管理
import systemRoutes from "./modules/system";
// 考试管理
import examRoutes from "./modules/exam";
// 课程模块
import courseRoutes from "./modules/course";
// 成绩管理模块
import scoreRoutes from "./modules/score";
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
    path: "/system",
    name: "System",
    component: { render: (h) => h("router-view") },
    meta: { title: "系统管理" },
    children: systemRoutes,
  },
  {
    path: "/course",
    name: "Course",
    component: { render: (h) => h("router-view") },
    meta: { title: "课程管理" },
    children: courseRoutes,
  },
  {
    path: "/exam",
    name: "Exam",
    component: { render: (h) => h("router-view") },
    meta: { title: "考试管理" },
    children: examRoutes,
  },
  {
    path: "/score",
    name: "Score",
    component: { render: (h) => h("router-view") },
    meta: { title: "成绩管理" },
    children: scoreRoutes,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
