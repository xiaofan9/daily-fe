import Vue from "vue";

import store from "./store";
import router from "./routes";

import App from "./app";

// import js
import "./handlers/resizeFont";
import "babel-polyfill";
import "whatwg-fetch";

// import css
import "./style/app";
import "./style/home";
import "./style/menu";
import "./style/content";

const app = new Vue({
  router,
  store,
  template: "<App/>",
  components: {
    App
  }
}).$mount("#app");

console.log("该页面所使用数据均来自知乎日报！");
