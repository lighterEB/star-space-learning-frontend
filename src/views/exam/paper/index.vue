<template>
  <div class="paper-manage">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item label="试卷名称" prop="name">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入试卷名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="科目" prop="subject">
          <el-select
            v-model="searchForm.subject"
            placeholder="请选择科目"
            clearable
          >
            <el-option
              v-for="item in subjectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="未发布" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已结束" value="finished" />
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
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i> 新增试卷
        </el-button>
        <el-button
          type="danger"
          @click="handleBatchDelete"
          :disabled="!selectedPapers.length"
        >
          <i class="el-icon-delete"></i> 批量删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="paperList"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="试卷名称" min-width="200">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="handleEdit(row)">{{
              row.name
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="120" />
        <el-table-column label="考试时长" width="100">
          <template slot-scope="{ row }"> {{ row.duration }}分钟 </template>
        </el-table-column>
        <el-table-column label="总分" width="80">
          <template slot-scope="{ row }"> {{ row.totalScore }}分 </template>
        </el-table-column>
        <el-table-column label="及格分" width="80">
          <template slot-scope="{ row }"> {{ row.passScore }}分 </template>
        </el-table-column>
        <el-table-column prop="questionCount" label="题目数量" width="100" />
        <el-table-column label="状态" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="考试时间" width="300">
          <template slot-scope="{ row }">
            {{ row.startTime }} 至 {{ row.endTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="handlePreview(row)"
              v-if="row.status !== 'draft'"
              >预览</el-button
            >
            <el-button
              type="text"
              @click="handleEdit(row)"
              v-if="row.status === 'draft'"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="handlePublish(row)"
              v-if="row.status === 'draft'"
              >发布</el-button
            >
            <el-button
              type="text"
              @click="handleAnalysis(row)"
              v-if="row.status === 'finished'"
              >统计</el-button
            >
            <el-button
              type="text"
              style="color: #f56c6c"
              @click="handleDelete(row)"
              v-if="row.status === 'draft'"
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

    <!-- 试卷预览对话框 -->
    <el-dialog
      title="试卷预览"
      :visible.sync="previewDialogVisible"
      width="800px"
      class="preview-dialog"
    >
      <div class="paper-preview">
        <div class="paper-header">
          <h2>{{ currentPaper.name }}</h2>
          <div class="paper-info">
            <span>总分：{{ currentPaper.totalScore }}分</span>
            <span>及格分：{{ currentPaper.passScore }}分</span>
            <span>时长：{{ currentPaper.duration }}分钟</span>
          </div>
        </div>

        <div class="question-list">
          <div
            v-for="(section, sIndex) in currentPaper.sections"
            :key="sIndex"
            class="question-section"
          >
            <h3>{{ toChineseNumber(sIndex + 1) }}、{{ section.name }}</h3>
            <div
              v-for="(question, qIndex) in section.questions"
              :key="qIndex"
              class="question-item"
            >
              <div class="question-title">
                {{ qIndex + 1 }}. {{ question.title }}
                <span class="question-score">({{ question.score }}分)</span>
              </div>
              <div
                class="question-options"
                v-if="
                  question.type === 'single' || question.type === 'multiple'
                "
              >
                <div
                  v-for="(option, oIndex) in question.options"
                  :key="oIndex"
                  class="option-item"
                >
                  {{ ["A", "B", "C", "D"][oIndex] }}. {{ option }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PaperManage",
  data() {
    return {
      // 搜索表单
      searchForm: {
        name: "",
        subject: "",
        status: "",
      },
      // 科目选项
      subjectOptions: [
        { label: "语文", value: "chinese" },
        { label: "数学", value: "math" },
        { label: "英语", value: "english" },
      ],
      // 表格数据
      loading: false,
      paperList: [],
      selectedPapers: [],
      // 分页
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      // 预览对话框
      previewDialogVisible: false,
      currentPaper: {},
    };
  },
  created() {
    this.fetchPaperList();
  },
  methods: {
    // 获取试卷列表
    async fetchPaperList() {
      this.loading = true;
      try {
        // 模拟API调用
        setTimeout(() => {
          this.paperList = Array(10)
            .fill(null)
            .map((_, index) => ({
              id: index + 1,
              name: `${this.subjectOptions[index % 3].label}期末考试试卷`,
              subject: this.subjectOptions[index % 3].label,
              duration: 120,
              totalScore: 100,
              passScore: 60,
              questionCount: 20,
              status: ["draft", "published", "finished"][index % 3],
              startTime: "2024-03-01 09:00:00",
              endTime: "2024-03-01 11:00:00",
            }));
          this.page.total = 100;
          this.loading = false;
        }, 500);
      } catch (error) {
        this.loading = false;
        this.$message.error("获取试卷列表失败");
      }
    },
    // 获取状态类型
    getStatusType(status) {
      const statusMap = {
        draft: "info",
        published: "success",
        finished: "",
      };
      return statusMap[status];
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        draft: "未发布",
        published: "已发布",
        finished: "已结束",
      };
      return statusMap[status];
    },
    // 数字转中文
    toChineseNumber(num) {
      const chinese = [
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
      ];
      return chinese[num - 1];
    },
    // 搜索
    handleSearch() {
      this.page.current = 1;
      this.fetchPaperList();
    },
    // 重置搜索
    resetSearch() {
      this.$refs.searchForm.resetFields();
      this.handleSearch();
    },
    // 表格选择
    handleSelectionChange(val) {
      this.selectedPapers = val;
    },
    // 新增试卷
    handleAdd() {
      this.$router.push("/exam/paper/edit");
    },
    // 编辑试卷
    handleEdit(row) {
      this.$router.push(`/exam/paper/edit/${row.id}`);
    },
    // 预览试卷
    handlePreview(row) {
      this.currentPaper = {
        ...row,
        sections: [
          {
            name: "单选题",
            questions: [
              {
                title: "下列选项中，哪个是JavaScript的基本数据类型？",
                type: "single",
                score: 2,
                options: ["Array", "Object", "String", "Function"],
              },
              // ... 更多题目
            ],
          },
          // ... 更多题型
        ],
      };
      this.previewDialogVisible = true;
    },
    // 发布试卷
    handlePublish() {
      this.$confirm("确认发布该试卷吗？发布后将不能修改", "提示", {
        type: "warning",
      })
        .then(async () => {
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success("发布成功");
            this.fetchPaperList();
          } catch (error) {
            this.$message.error("发布失败");
          }
        })
        .catch(() => {});
    },
    // 统计分析
    handleAnalysis(row) {
      this.$router.push(`/exam/paper/analysis/${row.id}`);
    },
    // 删除试卷
    handleDelete() {
      this.$confirm("确认删除该试卷吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success("删除成功");
            this.fetchPaperList();
          } catch (error) {
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },
    // 批量删除
    handleBatchDelete() {
      const names = this.selectedPapers.map((paper) => paper.name).join("、");
      this.$confirm(`确认删除以下试卷吗？\n${names}`, "提示", {
        type: "warning",
      })
        .then(async () => {
          try {
            // 模拟API调用
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.$message.success("批量删除成功");
            this.fetchPaperList();
          } catch (error) {
            this.$message.error("批量删除失败");
          }
        })
        .catch(() => {});
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchPaperList();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchPaperList();
    },
  },
};
</script>

<style lang="scss" scoped>
.paper-manage {
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

.preview-dialog {
  .paper-preview {
    .paper-header {
      text-align: center;
      margin-bottom: 20px;

      h2 {
        margin: 0 0 10px;
      }

      .paper-info {
        color: #666;

        span {
          margin: 0 10px;
        }
      }
    }

    .question-section {
      margin-bottom: 20px;

      h3 {
        margin: 0 0 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
    }

    .question-item {
      margin-bottom: 15px;

      .question-title {
        margin-bottom: 10px;

        .question-score {
          color: #f56c6c;
          margin-left: 5px;
        }
      }

      .question-options {
        padding-left: 20px;

        .option-item {
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>
