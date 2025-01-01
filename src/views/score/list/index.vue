<template>
  <div class="score-manage">
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
        <el-form-item label="课程名称" prop="courseName">
          <el-input
            v-model="searchForm.courseName"
            placeholder="请输入课程名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="考试名称" prop="examName">
          <el-input
            v-model="searchForm.examName"
            placeholder="请输入考试名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 成绩列表 -->
    <el-card class="table-card">
      <el-table v-loading="loading" :data="scoreList" border>
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="courseName" label="课程名称" />
        <el-table-column prop="examName" label="考试名称" />
        <el-table-column prop="score" label="得分" width="80" />
        <el-table-column prop="maxScore" label="满分" width="80" />
        <el-table-column prop="timeUsed" label="用时(分钟)" width="100" />
        <el-table-column label="状态" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleView(row)">查看</el-button>
            <el-button
              type="text"
              @click="handleEdit(row)"
              v-if="row.status === '未批改'"
              >批改</el-button
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

    <!-- 成绩详情对话框 -->
    <el-dialog
      title="成绩详情"
      :visible.sync="detailDialogVisible"
      width="800px"
    >
      <div class="score-detail">
        <div class="detail-header">
          <h2>{{ currentRecord.username }} - {{ currentRecord.examName }}</h2>
          <div class="detail-info">
            <span
              >得分：{{ currentRecord.score }} /
              {{ currentRecord.maxScore }}</span
            >
            <span>用时：{{ currentRecord.timeUsed }}分钟</span>
          </div>
        </div>

        <div class="question-list">
          <div
            v-for="(answer, index) in currentRecord.answers"
            :key="index"
            class="question-item"
          >
            <div class="question-title">
              {{ index + 1 }}. {{ answer.questionTitle }}
              <span class="question-score">({{ answer.score }}分)</span>
            </div>
            <div class="question-answer">
              <span>用户答案：{{ answer.userAnswer }}</span>
              <span v-if="answer.isCorrect" class="correct">正确</span>
              <span v-else class="wrong">错误</span>
            </div>
            <div class="question-analysis" v-if="answer.analysis">
              <span>解析：{{ answer.analysis }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ScoreManage",
  data() {
    return {
      // 搜索表单
      searchForm: {
        username: "",
        courseName: "",
        examName: "",
      },
      // 成绩列表
      loading: false,
      scoreList: [],
      // 分页
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      // 成绩详情
      detailDialogVisible: false,
      currentRecord: {
        username: "",
        examName: "",
        score: 0,
        maxScore: 0,
        timeUsed: 0,
        answers: [],
      },
    };
  },
  created() {
    this.fetchScoreList();
  },
  methods: {
    // 获取成绩列表
    async fetchScoreList() {
      this.loading = true;
      try {
        // 模拟API调用
        setTimeout(() => {
          this.scoreList = Array(10)
            .fill(null)
            .map((_, index) => ({
              id: index + 1,
              username: `用户${index + 1}`,
              courseName: `课程${index + 1}`,
              examName: `期末考试`,
              score: Math.floor(Math.random() * 100),
              maxScore: 100,
              timeUsed: Math.floor(Math.random() * 120),
              status: Math.random() > 0.5 ? "已批改" : "未批改",
            }));
          this.page.total = 100;
          this.loading = false;
        }, 500);
      } catch (error) {
        this.loading = false;
        this.$message.error("获取成绩列表失败");
      }
    },
    // 获取状态文本
    getStatusText(status) {
      return status;
    },
    // 获取状态类型
    getStatusType(status) {
      return status === "已批改" ? "success" : "warning";
    },
    // 搜索
    handleSearch() {
      this.page.current = 1;
      this.fetchScoreList();
    },
    // 重置搜索
    resetSearch() {
      this.$refs.searchForm.resetFields();
      this.handleSearch();
    },
    // 查看成绩详情
    handleView(row) {
      this.currentRecord = {
        ...row,
        answers: [
          {
            questionTitle: "下列选项中，哪个是JavaScript的基本数据类型？",
            userAnswer: "String",
            score: 2,
            isCorrect: true,
            analysis:
              "JavaScript的基本数据类型包括：Number, String, Boolean, Null, Undefined, Symbol, BigInt。",
          },
          // ... 更多题目
        ],
      };
      this.detailDialogVisible = true;
    },
    // 批改成绩
    handleEdit(row) {
      this.$router.push(`/exam/score/edit/${row.id}`);
    },
    // 分页大小改变
    handleSizeChange(val) {
      this.page.size = val;
      this.fetchScoreList();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.page.current = val;
      this.fetchScoreList();
    },
  },
};
</script>

<style lang="scss" scoped>
.score-manage {
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

.score-detail {
  .detail-header {
    text-align: center;
    margin-bottom: 20px;

    h2 {
      margin: 0 0 10px;
    }

    .detail-info {
      color: #666;

      span {
        margin: 0 10px;
      }
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

    .question-answer {
      margin-bottom: 5px;

      .correct {
        color: #67c23a;
        margin-left: 10px;
      }

      .wrong {
        color: #f56c6c;
        margin-left: 10px;
      }
    }

    .question-analysis {
      color: #909399;
    }
  }
}
</style>
