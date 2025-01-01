<template>
  <div class="role-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="searchForm.roleName"
            placeholder="请输入角色名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input
            v-model="searchForm.roleCode"
            placeholder="请输入角色编码"
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

    <!-- 操作按钮和表格 -->
    <el-card class="table-card">
      <div class="table-operations">
        <el-button type="primary" @click="handleAdd" v-permission="['admin']">
          <i class="el-icon-plus"></i> 新增角色
        </el-button>
      </div>

      <el-table v-loading="loading" :data="roleList" border>
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="roleCode" label="角色编码" />
        <el-table-column
          prop="description"
          label="角色描述"
          show-overflow-tooltip
        />
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template slot-scope="{ row }">
            {{ row.createTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handlePermission(row)"
              >分配权限</el-button
            >
            <el-button
              type="text"
              style="color: #f56c6c"
              @click="handleDelete(row)"
              :disabled="row.roleCode === 'admin'"
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

    <!-- 角色表单对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input
            v-model="roleForm.roleCode"
            placeholder="请输入角色编码"
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="roleForm.status"
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

    <!-- 权限分配对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="permissionDialogVisible"
      width="600px"
    >
      <el-form label-width="100px">
        <el-form-item label="角色名称">
          <el-input v-model="currentRole.roleName" disabled />
        </el-form-item>
        <el-form-item label="权限分配">
          <el-tree
            ref="permissionTree"
            :data="permissionTree"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedPermissions"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handlePermissionSubmit"
          :loading="permissionSubmitLoading"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RoleManage",
  data() {
    return {
      // 搜索表单
      searchForm: {
        roleName: "",
        roleCode: "",
        status: "",
      },
      // 表格数据
      loading: false,
      roleList: [],
      // 分页
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      // 角色表单对话框
      dialogVisible: false,
      dialogType: "add",
      submitLoading: false,
      roleForm: {
        roleName: "",
        roleCode: "",
        description: "",
        status: 1,
      },
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        roleCode: [
          { required: true, message: "请输入角色编码", trigger: "blur" },
          {
            pattern: /^[A-Z_]+$/,
            message: "角色编码只能包含大写字母和下划线",
            trigger: "blur",
          },
        ],
      },
      // 权限分配对话框
      permissionDialogVisible: false,
      permissionSubmitLoading: false,
      currentRole: {},
      permissionTree: [],
      checkedPermissions: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    this.fetchRoleList();
    this.fetchPermissionTree();
  },
  methods: {
    // 获取角色列表
    async fetchRoleList() {
      this.loading = true;
      try {
        // 模拟API调用
        setTimeout(() => {
          this.roleList = [
            {
              id: 1,
              roleName: "超级管理员",
              roleCode: "ADMIN",
              description: "系统最高权限",
              status: 1,
              createTime: new Date().toISOString(),
            },
            {
              id: 2,
              roleName: "教师",
              roleCode: "TEACHER",
              description: "课程管理权限",
              status: 1,
              createTime: new Date().toISOString(),
            },
            {
              id: 3,
              roleName: "学生",
              roleCode: "STUDENT",
              description: "学习权限",
              status: 1,
              createTime: new Date().toISOString(),
            },
          ];
          this.page.total = 3;
          this.loading = false;
        }, 500);
      } catch (error) {
        this.loading = false;
        this.$message.error("获取角色列表失败");
      }
    },
    // 获取权限树
    async fetchPermissionTree() {
      try {
        // 模拟API调用
        this.permissionTree = [
          {
            id: 1,
            name: "系统管理",
            children: [
              {
                id: 11,
                name: "用户管理",
                children: [
                  { id: 111, name: "查看用户" },
                  { id: 112, name: "新增用户" },
                  { id: 113, name: "编辑用户" },
                  { id: 114, name: "删除用户" },
                ],
              },
              {
                id: 12,
                name: "角色管理",
                children: [
                  { id: 121, name: "查看角色" },
                  { id: 122, name: "新增角色" },
                  { id: 123, name: "编辑角色" },
                  { id: 124, name: "删除角色" },
                ],
              },
            ],
          },
          {
            id: 2,
            name: "课程管理",
            children: [
              {
                id: 21,
                name: "课程列表",
                children: [
                  { id: 211, name: "查看课程" },
                  { id: 212, name: "新增课程" },
                  { id: 213, name: "编辑课程" },
                  { id: 214, name: "删除课程" },
                ],
              },
            ],
          },
        ];
      } catch (error) {
        this.$message.error("获取权限列表失败");
      }
    },
    // 搜索
    handleSearch() {
      this.page.current = 1;
      this.fetchRoleList();
    },
    // 重置搜索
    resetSearch() {
      this.$refs.searchForm.resetFields();
      this.handleSearch();
    },
    // 新增角色
    handleAdd() {
      this.dialogType = "add";
      this.roleForm = {
        roleName: "",
        roleCode: "",
        description: "",
        status: 1,
      };
      this.dialogVisible = true;
    },
    // 编辑角色
    handleEdit(row) {
      this.dialogType = "edit";
      this.roleForm = { ...row };
      this.dialogVisible = true;
    },
    // 提交角色表单
    handleSubmit() {
      this.$refs.roleForm.validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success(
              this.dialogType === "add" ? "新增成功" : "修改成功"
            );
            this.dialogVisible = false;
            this.fetchRoleList();
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
    // 删除角色
    handleDelete() {
      this.$confirm("确认删除该角色吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success("删除成功");
            this.fetchRoleList();
          } catch (error) {
            this.$message.error("删除失败");
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
    // 分配权限
    handlePermission(row) {
      this.currentRole = row;
      // 模拟获取已分配的权限
      this.checkedPermissions = [111, 121, 211];
      this.permissionDialogVisible = true;
    },
    // 提交权限分配
    async handlePermissionSubmit() {
      this.permissionSubmitLoading = true;
      try {
        // const checkedKeys = this.$refs.permissionTree.getCheckedKeys();
        // const halfCheckedKeys = this.$refs.permissionTree.getHalfCheckedKeys();
        // const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys];

        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 500));
        this.$message.success("权限分配成功");
        this.permissionDialogVisible = false;
      } catch (error) {
        this.$message.error("权限分配失败");
      } finally {
        this.permissionSubmitLoading = false;
      }
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchRoleList();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchRoleList();
    },
  },
  filters: {
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleString();
    },
  },
};
</script>

<style lang="scss" scoped>
.role-manage {
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

// 权限树样式
.el-tree {
  max-height: 400px;
  overflow-y: auto;
}
</style>
