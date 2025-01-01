<template>
  <div id="app">
    <el-container v-if="!isLoginPage">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <div class="logo-container">
          <!-- <img src="@/assets/images/logo.png" alt="StarSpace" class="logo-img"> -->
          <span class="logo-text">星火在线学习系统</span>
        </div>
        <!-- 侧边菜单 -->
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system/user">用户管理</el-menu-item>
            <el-menu-item index="/system/role">角色管理</el-menu-item>
            <el-menu-item index="/system/menu">菜单管理</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-reading"></i>
              <span>课程管理</span>
            </template>
            <el-menu-item index="/course/list">课程列表</el-menu-item>
            <el-menu-item index="/course/category">课程分类</el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-folder"></i>
              <span>资源管理</span>
            </template>
            <el-menu-item index="/resource/document">文档资源</el-menu-item>
            <el-menu-item index="/resource/video">视频资源</el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-edit-outline"></i>
              <span>考试管理</span>
            </template>
            <el-menu-item index="/exam/paper">试卷管理</el-menu-item>
            <el-menu-item index="/exam/question">题库管理</el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-data-analysis"></i>
              <span>成绩管理</span>
            </template>
            <el-menu-item index="/score/list">成绩列表</el-menu-item>
            <el-menu-item index="/score/analysis">成绩分析</el-menu-item>
            <el-menu-item index="/score/report">成绩报告</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部导航 -->
        <el-header height="60px" class="header">
          <div class="header-left">
            <i
              :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
              @click="toggleSidebar"
              class="toggle-button"
            ></i>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentPath }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <div class="header-right">
            <el-input
              placeholder="搜索..."
              prefix-icon="el-icon-search"
              v-model="searchText"
              class="search-input"
            >
            </el-input>

            <el-dropdown trigger="click" @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" :src="userAvatar"></el-avatar>
                <span class="username">{{ username }}</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主要内容区 -->
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 登录页面不显示布局 -->
    <router-view v-else></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isCollapse: false,
      searchText: "",
      userAvatar: "",
      username: "Admin",
      currentPath: "",
    };
  },
  computed: {
    isLoginPage() {
      return this.$route.path === "/login";
    },
    activeMenu() {
      return this.$route.path;
    },
  },
  watch: {
    $route: {
      handler(route) {
        this.currentPath = route.meta.title || route.name;
      },
      immediate: true,
    },
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse;
    },
    handleCommand(command) {
      switch (command) {
        case "profile":
          this.$router.push("/profile");
          break;
        case "settings":
          this.$router.push("/settings");
          break;
        case "logout":
          this.$confirm("确认退出系统吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              // 这里添加登出逻辑
              this.$router.push("/login");
            })
            .catch(() => {});
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.aside {
  background-color: #304156;
  height: 100vh;
  transition: width 0.3s;
  overflow-x: hidden;

  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background: #2b2f3a;

    .logo-img {
      width: 32px;
      height: 32px;
    }

    .logo-text {
      margin-left: 12px;
      color: #fff;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .el-menu {
    border-right: none;
  }
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .header-left {
    display: flex;
    align-items: center;

    .toggle-button {
      font-size: 20px;
      cursor: pointer;
      margin-right: 20px;

      &:hover {
        color: #409eff;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .search-input {
      width: 200px;
      margin-right: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;

      .username {
        margin-left: 8px;
        font-size: 14px;
      }
    }
  }
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
  min-height: calc(100vh - 60px);
}

// 响应式布局
@media screen and (max-width: 768px) {
  .aside {
    width: 64px !important;

    .logo-text {
      display: none;
    }
  }

  .header {
    .search-input {
      display: none;
    }

    .username {
      display: none;
    }
  }
}
</style>

<style>
/* 全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: #f6f6f6;
}
</style>
