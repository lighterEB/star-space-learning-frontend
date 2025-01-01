<template>
  <div class="course-list">
    <!-- 搜索和操作区域 -->
    <div class="operation-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-input
            v-model="searchForm.keyword"
            placeholder="课程名称/讲师"
            prefix-icon="el-icon-search"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.category"
            placeholder="课程分类"
            clearable
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="searchForm.status"
            placeholder="课程状态"
            clearable
          >
            <el-option label="已发布" value="published" />
            <el-option label="未发布" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增课程</el-button
      >
    </div>

    <!-- 课程列表 -->
    <el-table v-loading="loading" :data="courseList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="课程信息" min-width="300">
        <template slot-scope="{ row }">
          <div class="course-info">
            <el-image
              :src="row.cover"
              :preview-src-list="[row.cover]"
              fit="cover"
              class="course-cover"
            />
            <div class="course-detail">
              <h3 class="course-title">{{ row.title }}</h3>
              <p class="course-desc">{{ row.description }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="teacher" label="讲师" width="120" />
      <el-table-column prop="category" label="分类" width="120" />
      <el-table-column prop="price" label="价格" width="120">
        <template slot-scope="{ row }">
          <span>￥{{ row.price.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="studentsCount" label="学习人数" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.studentsCount }}人</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : 'info'">
            {{ row.status === "published" ? "已发布" : "未发布" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleEdit(row)">编辑</el-button>
          <el-button
            :type="row.status === 'published' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === "published" ? "下架" : "发布" }}
          </el-button>
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
  </div>
</template>

<script>
export default {
  name: "CourseList",
  data() {
    return {
      loading: false,
      searchForm: {
        keyword: "",
        category: "",
        status: "",
      },
      categoryOptions: [
        { label: "前端开发", value: "frontend" },
        { label: "后端开发", value: "backend" },
        { label: "移动开发", value: "mobile" },
        { label: "数据科学", value: "data" },
        { label: "云计算", value: "cloud" },
      ],
      courseList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  created() {
    this.fetchCourseList();
  },
  methods: {
    // 获取课程列表
    fetchCourseList() {
      this.loading = true;
      // 模拟API请求
      setTimeout(() => {
        // Mock数据
        const mockData = Array(20)
          .fill(null)
          .map((_, index) => ({
            id: index + 1,
            title: `示例课程 ${index + 1}`,
            description: "这是一个示例课程描述，介绍课程的主要内容和学习目标。",
            cover: `https://picsum.photos/300/200?random=${index}`,
            teacher: ["张老师", "李老师", "王老师"][
              Math.floor(Math.random() * 3)
            ],
            category:
              this.categoryOptions[
                Math.floor(Math.random() * this.categoryOptions.length)
              ].label,
            price: Math.floor(Math.random() * 1000) + 99,
            studentsCount: Math.floor(Math.random() * 1000),
            status: Math.random() > 0.5 ? "published" : "draft",
            createTime: new Date().toISOString(),
          }));

        this.courseList = mockData;
        this.page.total = 100;
        this.loading = false;
      }, 500);
    },
    // 搜索
    handleSearch() {
      this.page.current = 1;
      this.fetchCourseList();
    },
    // 重置搜索
    resetSearch() {
      this.searchForm = {
        keyword: "",
        category: "",
        status: "",
      };
      this.handleSearch();
    },
    // 新增课程
    handleAdd() {
      this.$message.info("点击了新增课程");
    },
    // 编辑课程
    handleEdit(row) {
      this.$message.info(`点击了编辑课程 ${row.id}`);
    },
    // 切换课程状态
    handleToggleStatus(row) {
      const action = row.status === "published" ? "下架" : "发布";
      this.$confirm(`确认${action}该课程吗？`, "提示", {
        type: "warning",
      })
        .then(() => {
          this.$message.success(`${action}成功`);
          row.status = row.status === "published" ? "draft" : "published";
        })
        .catch(() => {});
    },
    // 删除课程
    handleDelete() {
      this.$confirm("确认删除该课程吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$message.success("删除成功");
          this.fetchCourseList();
        })
        .catch(() => {});
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchCourseList();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchCourseList();
    },
  },
};
</script>

<style lang="scss" scoped>
.course-list {
  .operation-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .search-form {
      margin-bottom: 0;
    }
  }

  .course-info {
    display: flex;
    align-items: flex-start;

    .course-cover {
      width: 120px;
      height: 80px;
      border-radius: 4px;
      margin-right: 12px;
    }

    .course-detail {
      flex: 1;
      overflow: hidden;

      .course-title {
        margin: 0 0 8px;
        font-size: 14px;
        line-height: 1.5;
        color: #303133;
      }

      .course-desc {
        margin: 0;
        font-size: 12px;
        color: #909399;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        overflow: hidden;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
