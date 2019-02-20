<template>
  <div class="loading">
    <div class="loading-icon"></div>
    <div class="loading-hint">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import "../style/loading";

export default {
  data() {
    return {
      loading_s: false,
      loading_h: "加载中"
    };
  },
  methods: {
    controlLoading(params = {}) {
      let { s = true, h = "加载中" } = params;

      this.loading_s = s;
      this.loading_h = h;
      this.oneTap = true;

      return {
        hide: c => {
          this.loading_s = false;
          this.oneTap = false;

          c && c();

          return this;
        }
      };
    }
  }
};
</script>
