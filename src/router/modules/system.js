export default [
  {
    path: "/system/user",
    name: "UserManage",
    component: () => import("@/views/system/user/index"),
    meta: { title: "用户管理" },
  },
];
