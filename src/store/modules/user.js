export default {
  namespaced: true,
  state: {
    token: localStorage.getItem("token") || "",
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "{}"),
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    CLEAR_USER_DATA(state) {
      state.token = "";
      state.userInfo = {};
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
  actions: {
    // 登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // 这里之后会改为真实的登录请求
        setTimeout(() => {
          const token = "mock-token";
          const userInfo = {
            id: 1,
            username: "admin",
            nickname: "管理员",
            avatar: "",
          };
          commit("SET_TOKEN", token);
          commit("SET_USER_INFO", userInfo);
          resolve();
        }, 1000);
      });
    },
    // 登出
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("CLEAR_USER_DATA");
        resolve();
      });
    },
  },
};
