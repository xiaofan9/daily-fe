<template>
  <div id="app">
    <home v-if="isHome"></home>
    <transition name="fade">
      <router-view @setIsHome="setIsHome"></router-view>
    </transition>
  </div>
</template>

<script>
import home from "./components/home";

export default {
  name: "App",
  data() {
    let isHome = localStorage.getItem("isHome")
      ? JSON.parse(localStorage.getItem("isHome"))
      : true;

    return {
      isHome: isHome
    };
  },
  mounted() {
    let that = this;

    window.onbeforeunload = function() {
      localStorage.setItem("isHome", that.$route.name === "home");
    };
  },
  components: {
    home
  },
  methods: {
    setIsHome(isHome) {
      console.log(1123);
      localStorage.setItem("isHome", true);
      this.isHome = isHome;
    }
  }
};
</script>
