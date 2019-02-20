import Vue from "vue";
import VueRouter from "vue-router";

import Content from "../components/content";
Vue.use(VueRouter); // 注册组件

const routes = [
  {
    path: "/",
    name: "home"
  },
  {
    path: "/content/:contentID",
    name: "content",
    component: Content
  }
];

export default new VueRouter({
  routes
});
