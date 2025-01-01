export default [
  {
    path: "/system/user",
    name: "UserManage",
    component: () => import("@/views/system/user/index"),
    meta: { title: "用户管理" },
  },
  {
    path: "/system/role",
    name: "RoleManage",
    component: () => import("@/views/system/role/index"),
    meta: { title: "角色管理" },
  },
];
