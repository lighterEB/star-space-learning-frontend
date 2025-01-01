export default [
  {
    path: "/score/list",
    name: "ScoreList",
    component: () => import("@/views/score/list/index"),
    meta: { title: "成绩列表" },
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
