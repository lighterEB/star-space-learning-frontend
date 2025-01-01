export default [
  {
    path: "/exam/paper",
    name: "PaperManage",
    component: () => import("@/views/exam/paper/index"),
    meta: { title: "试卷管理" },
  },
  // {
  //   path: "/exam/question",
  //   name: "QuestionMange",
  //   component: () => import("@/views/exam/question/index"),
  //   meta: { title: "题库管理" },
  // },
  // {
  //   path: "/exam/room",
  //   name: "ExamRoom",
  //   component: () => import("@/views/exam/room/index"),
  //   meta: { title: "在线考场" },
  // },
];
