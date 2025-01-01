<template>
  <div class="user-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card class="table-card">
      <div class="table-operations">
        <el-button type="primary" @click="handleAdd" v-permission="['admin']">
          <i class="el-icon-plus"></i> 新增用户
        </el-button>
        <el-button
          type="danger"
          @click="handleBatchDelete"
          :disabled="!selectedUsers.length"
        >
          <i class="el-icon-delete"></i> 批量删除
        </el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="userList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户名" prop="username" />
        <el-table-column label="昵称" prop="nickname" />
        <el-table-column label="手机号" prop="phone" />
        <el-table-column label="角色" prop="roleName" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180">
          <template slot-scope="{ row }">
            {{ row.createTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleAssignRole(row)"
              >分配角色</el-button
            >
            <el-button type="text" @click="handleResetPwd(row)"
              >重置密码</el-button
            >
            <el-button
              type="text"
              style="color: #f56c6c"
              @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        />
      </div>
    </el-card>

    <!-- 用户表单对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitLoading"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 角色分配对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="500px">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="currentUser.username" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="selectedRoles">
            <el-checkbox
              v-for="role in roleList"
              :key="role.id"
              :label="role.id"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleRoleSubmit"
          :loading="roleSubmitLoading"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UserManage",
  data() {
    // 手机号验证规则
    const validatePhone = (rule, value, callback) => {
      if (value && !/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };

    return {
      // 搜索表单
      searchForm: {
        username: "",
        phone: "",
        status: "",
      },
      // 表格数据
      loading: false,
      userList: [],
      selectedUsers: [],
      // 分页
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      // 用户表单对话框
      dialogVisible: false,
      dialogType: "add", // add or edit
      submitLoading: false,
      userForm: {
        username: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
      userRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        phone: [{ validator: validatePhone, trigger: "blur" }],
      },
      // 角色分配对话框
      roleDialogVisible: false,
      roleSubmitLoading: false,
      currentUser: {},
      roleList: [],
      selectedRoles: [],
    };
  },
  created() {
    this.fetchUserList();
    this.fetchRoleList();
  },
  methods: {
    // 获取用户列表
    async fetchUserList() {
      this.loading = true;
      try {
        // 模拟API调用
        setTimeout(() => {
          this.userList = Array(10)
            .fill(null)
            .map((_, index) => ({
              id: index + 1,
              username: `user${index + 1}`,
              nickname: `用户${index + 1}`,
              phone: "13800138000",
              roleName: "普通用户",
              status: Math.random() > 0.5 ? 1 : 0,
              createTime: new Date().toISOString(),
            }));
          this.page.total = 100;
          this.loading = false;
        }, 500);
      } catch (error) {
        this.loading = false;
        this.$message.error("获取用户列表失败");
      }
    },
    // 获取角色列表
    async fetchRoleList() {
      try {
        // 模拟API调用
        this.roleList = [
          { id: 1, roleName: "管理员" },
          { id: 2, roleName: "教师" },
          { id: 3, roleName: "学生" },
        ];
      } catch (error) {
        this.$message.error("获取角色列表失败");
      }
    },
    // 搜索
    handleSearch() {
      this.page.current = 1;
      this.fetchUserList();
    },
    // 重置搜索
    resetSearch() {
      this.$refs.searchForm.resetFields();
      this.handleSearch();
    },
    // 表格选择
    handleSelectionChange(val) {
      this.selectedUsers = val;
    },
    // 新增用户
    handleAdd() {
      this.dialogType = "add";
      this.userForm = {
        username: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
      this.dialogVisible = true;
    },
    // 编辑用户
    handleEdit(row) {
      this.dialogType = "edit";
      this.userForm = { ...row };
      this.dialogVisible = true;
    },
    // 提交用户表单
    handleSubmit() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success(
              this.dialogType === "add" ? "新增成功" : "修改成功"
            );
            this.dialogVisible = false;
            this.fetchUserList();
          } catch (error) {
            this.$message.error(
              this.dialogType === "add" ? "新增失败" : "修改失败"
            );
          } finally {
            this.submitLoading = false;
          }
        }
      });
    },
    // 删除用户
    handleDelete() {
      this.$confirm("确认删除该用户吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success("删除成功");
            this.fetchUserList();
          } catch (error) {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },
    // 批量删除
    handleBatchDelete() {
      const usernames = this.selectedUsers
        .map((user) => user.username)
        .join("、");
      this.$confirm(`确认删除用户 ${usernames} 吗？`, "提示", {
        type: "warning",
      })
        .then(async () => {
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success("批量删除成功");
            this.fetchUserList();
          } catch (error) {
            this.$message.error("批量删除失败");
          }
        })
        .catch(() => {});
    },
    // 状态改变
    async handleStatusChange(row) {
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.$message.success("状态修改成功");
      } catch (error) {
        row.status = row.status === 1 ? 0 : 1; // 回退状态
        this.$message.error("状态修改失败");
      }
    },
    // 分配角色
    handleAssignRole(row) {
      this.currentUser = row;
      this.selectedRoles = [1]; // 模拟已分配的角色
      this.roleDialogVisible = true;
    },
    // 提交角色分配
    async handleRoleSubmit() {
      this.roleSubmitLoading = true;
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.$message.success("角色分配成功");
        this.roleDialogVisible = false;
        this.fetchUserList();
      } catch (error) {
        this.$message.error("角色分配失败");
      } finally {
        this.roleSubmitLoading = false;
      }
    },
    // 重置密码
    handleResetPwd() {
      this.$confirm("确认重置该用户的密码吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success("密码重置成功");
          } catch (error) {
            this.$message.error("密码重置失败");
          }
        })
        .catch(() => {});
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchUserList();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchUserList();
    },
  },
  filters: {
    // 日期格式化
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style lang="scss" scoped>
.user-manage {
  padding: 20px;

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .table-operations {
      margin-bottom: 20px;
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}

// 对话框中的表单样式
.el-dialog {
  .el-form {
    padding: 0 20px;
  }
}

// 角色选择框样式
.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
