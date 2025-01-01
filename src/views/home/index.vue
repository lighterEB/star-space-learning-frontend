<template>
  <div class="dashboard">
    <!-- 统计卡片区域 -->
    <el-row :gutter="20" class="panel-group">
      <el-col
        :xs="12"
        :sm="12"
        :md="6"
        :lg="6"
        v-for="item in statCards"
        :key="item.title"
      >
        <div class="card-panel" :class="item.type">
          <div class="card-panel-icon">
            <i :class="item.icon"></i>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ item.title }}</div>
            <div class="card-panel-num">{{ item.value }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <el-card class="chart-wrapper">
          <div slot="header" class="clearfix">
            <span>课程学习趋势</span>
            <el-radio-group
              v-model="chartDateRange"
              size="small"
              style="float: right"
            >
              <el-radio-button label="week">本周</el-radio-button>
              <el-radio-button label="month">本月</el-radio-button>
              <el-radio-button label="year">全年</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <!-- 这里需要引入 echarts -->
            <div ref="learningTrendChart" style="height: 350px"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card class="chart-wrapper">
          <div slot="header" class="clearfix">
            <span>课程分类分布</span>
          </div>
          <div class="chart-container">
            <div ref="categoryPieChart" style="height: 350px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态 -->
    <el-row :gutter="20" class="activity-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>最新学员</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >查看全部</el-button
            >
          </div>
          <div class="activity-list">
            <div
              v-for="(activity, index) in recentStudents"
              :key="index"
              class="activity-item"
            >
              <el-avatar :size="32" :src="activity.avatar"></el-avatar>
              <div class="activity-info">
                <span class="username">{{ activity.name }}</span>
                <span class="action">加入了课程</span>
                <span class="course">《{{ activity.course }}》</span>
              </div>
              <span class="time">{{ activity.time }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>热门课程</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >查看全部</el-button
            >
          </div>
          <el-table :data="hotCourses" style="width: 100%" :show-header="false">
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.$index < 3 ? 'danger' : 'info'"
                  size="mini"
                >
                  {{ scope.$index + 1 }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" />
            <el-table-column prop="count" width="100" align="right">
              <template slot-scope="scope">
                <span>{{ scope.row.count }}人</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "面板数据",
  data() {
    return {
      chartDateRange: "week",
      statCards: [
        {
          title: "总课程数",
          value: "93",
          icon: "el-icon-reading",
          type: "blue",
        },
        {
          title: "总学员数",
          value: "8,460",
          icon: "el-icon-user",
          type: "green",
        },
        {
          title: "今日学习",
          value: "2,345",
          icon: "el-icon-data-line",
          type: "orange",
        },
        {
          title: "总学习时长",
          value: "89,760h",
          icon: "el-icon-time",
          type: "purple",
        },
      ],
      recentStudents: [
        {
          name: "张三",
          avatar:
            "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
          course: "Vue.js 实战教程",
          time: "10分钟前",
        },
        // ... 添加更多数据
      ],
      hotCourses: [
        {
          title: "Vue.js 实战教程",
          count: 1234,
        },
        // ... 添加更多数据
      ],
    };
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      // 初始化趋势图
      const trendChart = echarts.init(this.$refs.learningTrendChart);
      trendChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
            areaStyle: {},
          },
        ],
      });

      // 初始化饼图
      const pieChart = echarts.init(this.$refs.categoryPieChart);
      pieChart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "前端开发" },
              { value: 735, name: "后端开发" },
              { value: 580, name: "移动开发" },
              { value: 484, name: "数据科学" },
              { value: 300, name: "云计算" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });

      // 监听窗口大小变化
      window.addEventListener("resize", () => {
        trendChart.resize();
        pieChart.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;

  .panel-group {
    margin-bottom: 20px;

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      border-color: rgba(0, 0, 0, 0.05);
      padding: 20px;
      display: flex;
      align-items: center;

      &:hover {
        .card-panel-icon {
          transform: translateY(-10px);
        }
      }

      .card-panel-icon {
        float: left;
        margin-right: 15px;
        transition: all 0.38s ease-out;

        i {
          font-size: 48px;
        }
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px 0 0 0;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }

      &.blue {
        .card-panel-icon {
          color: #409eff;
        }
      }

      &.green {
        .card-panel-icon {
          color: #67c23a;
        }
      }

      &.orange {
        .card-panel-icon {
          color: #e6a23c;
        }
      }

      &.purple {
        .card-panel-icon {
          color: #909399;
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px;
      margin-bottom: 32px;

      .chart-container {
        position: relative;
        width: 100%;
      }
    }
  }

  .activity-row {
    .activity-list {
      .activity-item {
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;

        &:last-child {
          border-bottom: none;
        }

        .activity-info {
          flex: 1;
          margin: 0 15px;

          .username {
            font-weight: bold;
            margin-right: 5px;
          }

          .action {
            color: #909399;
            margin-right: 5px;
          }

          .course {
            color: #409eff;
          }
        }

        .time {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}
</style>
