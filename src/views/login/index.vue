<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="title">
        <h2>星火在线学习系统</h2>
        <p>智慧星火在线学习平台</p>
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="请输入密码"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input
              v-model="loginForm.captcha"
              prefix-icon="el-icon-key"
              placeholder="请输入验证码"
              class="captcha-input"
            />
            <div class="captcha-img" @click.prevent="refreshCaptcha">
              <span v-text="captchaText" :key="captchaKey"></span>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          <el-link type="primary" class="forget-pwd" :underline="false"
            >忘记密码？</el-link
          >
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? "登录中..." : "登录" }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    // 验证码验证规则
    const validateCaptcha = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入验证码"));
      } else if (value.toLowerCase() !== this.captchaText.toLowerCase()) {
        callback(new Error("验证码错误"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        remember: false,
        captcha: "",
      },
      loginRules: {
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
        captcha: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: validateCaptcha, trigger: "change" },
        ],
      },
      loading: false,
      captchaText: "",
      captchaKey: 0, // 添加key来强制更新
    };
  },
  created() {
    this.refreshCaptcha();
  },
  methods: {
    // 生成随机验证码
    generateCaptcha() {
      const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let result = "";
      for (let i = 0; i < 4; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    },
    // 刷新验证码
    refreshCaptcha() {
      console.log("刷新验证码");
      this.captchaText = this.generateCaptcha();
      this.loginForm.captcha = ""; // 清空输入框
      this.captchaKey += 1; // 更新key触发重新渲染
      console.log("新验证码:", this.captchaText);
    },
    // 修改登录处理方法
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$message.success("登录成功");
            this.$router.push("/");
          }, 1500);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);

  .login-card {
    width: 400px;
    padding: 20px 35px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .title {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        margin: 0;
        font-size: 24px;
        color: #303133;
      }

      p {
        margin: 10px 0 0;
        font-size: 14px;
        color: #909399;
      }
    }

    .login-form {
      .el-input {
        height: 40px;

        :deep(.el-input__inner) {
          height: 40px;
          line-height: 40px;
        }
      }
      .forget-pwd {
        float: right;
      }

      .login-button {
        width: 100%;
        height: 40px;
      }
    }
  }
  .captcha-container {
    display: flex;
    align-items: center;
    gap: 10px;

    .captcha-input {
      flex: 1;
    }
    .captcha-img {
      width: 100px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #f0f2f5;
      font-family: "Arial", sans-serif;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 4px;
      cursor: pointer;
      user-select: none;
      color: #666;
      border-radius: 4px;
      transition: background-color 0.3s;

      &:hover {
        background: #e6e8eb;
      }
      &:active {
        background: #d9d9d9;
      }
    }
  }
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
}
</style>
