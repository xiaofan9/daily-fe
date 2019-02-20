<template>
  <section class='menu-warp'>
    <div class="menu-content">
      <p class="web-hint">
        根据知乎日报app修改！
        <span class="auth">--- 小凡</span>
      </p>
      <ul class='item-lists'>
        <li :class="nowMenuName === '首页' ? 'active' : ''">
          <a href='javascript:void(0);' class='home' @click="changeContent('首页')">
            首页
          </a>
        </li>
        <li v-for="(item,idx) in themeData" :key="idx" :class="nowMenuName === item.name ? 'active' : ''">
          <a href='javascript:void(0);' @click="changeContent(item.name)">
            {{item.name}}
          </a>
        </li>
      </ul>
    </div>
    <div class='menu-bg' :class="menuStatus ? 'menu-bg-show' : ''" @click='changeMenuStatus(!menuStatus)'></div>
  </section>
</template>
<script>
import "../style/menu";

import { mapState, mapMutations } from "vuex";

export default {
  props: ["themeData"],
  computed: mapState(["menuStatus", "nowMenuName"]),
  mounted() {
    this.homeMain = document.querySelector("section.home main"); //主页内容
  },
  methods: {
    ...mapMutations(["changeMenuStatus", "changeNowMenuName"]),
    changeContent(name) {
      //切换主题
      if (this.nowMenuName === name) return this.changeMenuStatus(false);

      this.homeMain.scrollTop = 0;
      this.changeMenuStatus(false);
      this.changeNowMenuName(name);
    }
  }
};
</script>
