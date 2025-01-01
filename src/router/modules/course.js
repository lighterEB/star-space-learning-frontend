export default [
  {
    path: "/course/list",
    name: "CourseList",
    component: () => import("@/views/course/list/index"),
    meta: { title: "课程列表" },
  },
];
