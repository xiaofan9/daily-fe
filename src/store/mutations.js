export default {
  changeMenuStatus(state, status) {
    state.menuStatus = status;
  },
  changeNowMenuName(state, nowMenuName) {
    state.nowMenuName = nowMenuName;
  },
  setFeedBackStatus(state, feedBackStatus) {
    state.feedBackStatus = feedBackStatus;
  },
  setIsProd(state, isProd) {
    state.isProd = isProd;
  }
};
