<template>
  <section class="home">
    <header class="common">
      <a
        class='menu-bar-icon'
        href='javascript:void(0);'
        @click="changeMenuStatus(!menuStatus)"
      >
        <span></span>
        <span></span>
        <span></span>
      </a>
      <span class='select-hint'>
        {{mainTitle}}
      </span>
      <a
        class='my-github'
        href="https://github.com/xiaofan9"
      ></a>
    </header>
    <main>
      <section
        class='top_stories'
        v-if="nowMenuName == '首页'"
      >
        <swiper
          :options="swiperOption"
          class='top_stories-item-list'
        >
          <!-- 幻灯内容 -->
          <swiper-slide
            class='top_stories-item'
            v-for='(item,index) in top_stories'
            :data-id="item.id"
            :key="index"
          >
            <img
              :src="item.image"
              class="bg"
            >
            <span class="title">
              {{item.title}}
            </span>
          </swiper-slide>
        </swiper>
        <div class='swiper-pagination'></div>
      </section>
      <section
        class="top_theme"
        v-else
      >
        <img
          class="top_theme-bg"
          :src="top_theme.bg"
        >
        <p class="top_theme-title">{{top_theme.description}}</p>
      </section>
      <section
        class='home-stories-item-list'
        v-if="nowMenuName == '首页'"
      >
        <div
          v-for='(item,index) in stories'
          class='home-stories-item clear'
          :key="index"
        >
          <div class='title'>
            {{item.title}}
          </div>
          <div class='stories-item-list'>
            <div
              class="stories-item"
              v-for='(subitem,index) in item.content'
              @click="toContentPages(subitem.id)"
              :key="index"
            >
              <span
                class='sub-title'
                :style="{ width: subitem.images ? 'calc(100% - 86px)' : '100%' }"
              >{{subitem.title}}</span>
              <img
                v-if="subitem.images"
                :src="subitem.images.join('')"
                width='68'
                height='60'
              >
            </div>
          </div>
        </div>
      </section>
      <section
        class="theme_stories-warp"
        v-else
      >
        <div class="theme-editors">
          <span>主编</span>
          <a
            href="javascript:void(0);"
            class="theme-editors-avatar"
            v-for="(item,index) in editors"
            :key="index"
            :style="'background: url(' + item.avatar + ') no-repeat;background-size:cover;'"
          >
          </a>
        </div>
        <div class='stories-item-list clear'>
          <div
            class='stories-item'
            v-for='(item,index) in stories'
            @click="toContentPages(item.id)"
            :key="index"
          >
            <span
              class='sub-title'
              :style="{ width: item.images ? 'calc(100% - 86px)' : '100%' }"
            >{{item.title}}</span>
            <img
              v-if="item.images"
              :src="item.images.join('')"
              width='68'
              height='60'
            >
          </div>
        </div>
      </section>
    </main>
    <menuBar
      id='menu'
      :class="menuStatus ? 'menu-show' : ''"
      :theme-data='themsListData'
    >
    </menuBar>
    <Loading v-if="loading">
      加載中…
    </Loading>
  </section>
</template>

<script>
import menuBar from "./menu";
import Loading from "./loading";

import { mapState, mapGetters, mapMutations } from "vuex";

import { swiper, swiperSlide } from "vue-awesome-swiper";

import config from "../config";

export default {
  computed: {
    ...mapState(["nowMenuName", "menuStatus"]),
    stories() {
      if (this.contentListData.content !== undefined)
        return this.contentListData.content[this.nowMenuName].stories;

      return [];
    },
    editors() {
      if (this.nowMenuName === "首页") return {};

      return this.contentListData.content[this.nowMenuName].editors;
    },
    mainTitle() {
      return this.nowMenuName;
    },
    top_stories() {
      if (this.contentListData.content !== undefined)
        return this.contentListData.content[this.nowMenuName].top_stories;
      return [];
    },
    top_theme() {
      if (this.nowMenuName === "首页") return {};

      return this.contentListData.content[this.nowMenuName].top_theme;
    }
  },
  watch: {
    "contentListData.findDate"(nv) {
      this.findDate = nv;
    }
  },
  data() {
    return {
      operateMenuOption: {
        //操作主菜单配置
        startTime: 0,
        startX: 0,
        appLoc: false, //合适位置
        rangTime: 0 //时间范围
      },
      contentListData: {}, //内容列表
      themsListData: {},
      doms: {},
      findDate: null,
      loading: false,
      isLoadData: false,
      url: config.url,
      swiperOption: {
        // swiper配置
        that: this,
        autoplay: 3500,
        setWrapperSize: true,
        pagination: ".swiper-pagination",
        paginationClickable: true,
        mousewheelControl: true,
        observeParents: true,
        autoplayDisableOnInteraction: false,
        onTap: function(s, e) {
          let id,
            target = e.target;

          if (target.className.indexOf("top_stories-item") !== -1)
            id = target.dataset.id;
          else id = target.parentElement.dataset.id;
          this.toContentPages(id);
        }.bind(this)
      }
    };
  },
  created() {
    this.getContentData();
  },
  methods: {
    ...mapMutations(["changeMenuStatus", "changeSelcetnowMenuName"]),
    async getContentData() {
      /*  数据大体结构
                contentData => {
                    findDate: 查询日期,
                    content: 所有的首页展示内容 => {
                        "首页" => {
                            top_stories: 顶部内容,
                            stories: 列表内容 => []
                        },
                        "其他页面内容" => {
                            editors: 主编列表,
                            top_theme: 顶部内容 => {
                                description,
                                bg
                            }
                            stories: 列表内容 => []
                        }
                    }
                }
            */
      this.loading = true;
      const this_ = this;

      let contentData = {};
      let latestData = await fetch(this.url + "latest?revise=true", {
        mode: "cors"
      })
        .then(res => res.json())
        .then(td => td.data); // 获取最新的数据
      contentData.findDate = latestData.date;

      contentData.content = {};
      contentData.content["首页"] = {
        top_stories: latestData.top_stories,
        stories: [
          {
            title: "今日热闻",
            content: latestData.stories
          }
        ]
      };

      this.themsListData = await fetch(this.url + "themes?revise=true")
        .then(res => res.json())
        .then(td => td.data.others); //获取主题列表

      this.themsListData.forEach(async v => {
        let themeData = await fetch(this.url + "theme/" + v.id + "?revise=true")
          .then(res => res.json())
          .then(td => td.data); //获取主题概况

        contentData.content[v.name] = {
          top_theme: {
            description: themeData.description,
            bg: themeData.background
          },
          editors: themeData.editors,
          stories: themeData.stories
        };

        this.$nextTick(() => {
          nextTick();
        });
      });

      if (!this.themsListData.length) {
        nextTick();
      }

      console.log(this_);

      function nextTick() {
        this_.loading = false;

        this_.contentListData = contentData;
        this_.operateDom();
      }
    },
    operateDom() {
      let oMain = document.querySelector(".home main");

      oMain.onscroll = async () => {
        if (this.mainTitle === "首页") {
          if (
            oMain.scrollTop + oMain.offsetHeight >= oMain.scrollHeight - 50 &&
            !this.isLoadData
          ) {
            this.isLoadData = true;
            this.loading = true;

            let findDate = this.getPrevDate(this.findDate);

            let url = this.url + "before/" + findDate + "?revise=true";

            let findDateData = await fetch(url, { mode: "cors" })
              .then(res => res.json())
              .then(td => td.data.stories);

            this.contentListData.content["首页"].stories.push({
              title: findDate,
              content: findDateData
            });

            this.findDate = findDate;
            this.findDateData = findDateData;
            this.isLoadData = false;
            this.loading = false;
          }
        }
      };
    },
    toContentPages(id) {
      this.$router.push({ name: "content", params: { contentID: id } });
    },
    getPrevDate(date) {
      //获取昨天的日期
      let findYear = parseInt(date.substr(0, 4));
      let findMonth = parseInt(date.substr(4, 2));
      let findDate = parseInt(date.substr(6, 2));

      let prevYear =
        findDate == 1 ? (findMonth == 1 ? findYear - 1 : findYear) : findYear;

      let prevMonth =
        findDate == 1 ? (findMonth == 1 ? 12 : findMonth - 1) : findMonth;

      let prevDate =
        findDate === 1
          ? new Date(prevYear, prevMonth, 0).getDate()
          : findDate - 1;

      return (
        prevYear +
        (prevMonth > 9 ? prevMonth + "" : "0" + prevMonth) +
        (prevDate > 9 ? prevDate + "" : "0" + prevDate)
      );
    },
    outsideTop(d) {
      //返回距离顶部的高度
      let h = d.offsetTop;

      while (d.offsetParent) {
        d = d.offsetParent;
        h += d.offsetTop;
      }
      return h;
    }
  },
  components: {
    menuBar,
    swiper,
    swiperSlide,
    Loading
  }
};
</script>
