<template>
  <section class='content'>
    <header class="common">
      <a href="javascript:void(0);" class='back-off-icon' @click="backPrevPage"></a>
      <span class='select-hint'>
        内容
      </span>
      <a class='leave-word-icon' href='javascript:void(0);' @click="goComment">
        {{ storyExtra._write ? storyExtra.content.comments >= 1000 ? Math.floor(storyExtra.content.comments/100)/10 + "k" : storyExtra.content.comments : "..." }}
      </a>
      <a class='laud-icon' href='javascript:void(0);'>
        {{ storyExtra._write && storyExtra.content.popularity ? storyExtra.content.popularity >= 1000 ? Math.floor(storyExtra.content.popularity/100)/10 + "k" : storyExtra.content.popularity : "..." }}
      </a>
    </header>
    <main>
      <section class="top_theme" v-if="contentData.writeData && contentData.content.image">`
        <img class="top_theme-bg" :src="contentData.content.image" />
        <p class="top_theme-title">
          {{contentData.content.title}}
        </p>
        <span class="top_theme-image_source" v-if="contentData.content.image_source">
          {{contentData.content.image_source}}
        </span>
      </section>
      <div v-if="contentData.writeData" v-html="contentData.content.body"></div>
      <div v-if="contentData.writeData && !contentData.content.body" style="font-size:22px;height:200px;padding: 70px 20px 0;color:#000;box-sizing:border-box">
        此内容为知乎分享内容不支持查看！<br />
        <a :href='contentData.content.share_url' style="float:right; margin-top: 6px;">点击此处查看！</a>
      </div>
      <!--
                <a class="section" href="" v-if="contentData.writeData && contentData.content.section">
                    <img :src="'http://112.74.57.209:3000/api-zhihu/image-lists?zhiHuImgDomain=' + contentData.section.thumbnail" />
                    <p>
                        本文来自： {{contentData.content.section.name}}·合集
                    </p>
                </a>
            -->
    </main>
    <footer v-if="contentData.writeData">
      <p class="line"></p>
      <h3 id='comment'>評論：</h3>
      <article class='long-comments'>
        <h4>長評論：</h4>
        <p class="no-comment" v-if="!longComments._len">暂无</p>
        <section class='comment' v-for="(comment,idx) in longComments" :key="idx">
          <p class='comment-info'>
            <img :src="comment.avatar" />
            <span class='username'>{{comment.author}}</span>
            <span class='laud-num'>{{comment.likes}}</span>
            <span class='laud-icon'></span>
          </p>
          <p class='comment-content'>
            {{comment.content}}
          </p>
          <section v-if='comment.reply_to'>
            <span class='to-username'>//{{comment.reply_to.author}}:</span>
            {{comment.reply_to.content}}
          </section>
          <p class='comment-time'>
            {{ formatDate(comment.time, "yyyy年MM月dd日 hh时mm分ss秒") }}
          </p>
        </section>
      </article>
      <article class="short-comments">
        <h4>短評論：</h4>
        <p class="no-comment" v-if="!shortComments._len">暂无</p>
        <section class='comment' v-for="(comment,idx) in shortComments" :key="idx">
          <p class='comment-info'>
            <img :src="comment.avatar" />
            <span class='username'>
              {{comment.author}}
            </span>
            <span class='laud-num'>
              {{comment.likes}}
            </span>
            <span class='laud-icon'></span>
          </p>
          <p class='comment-content'>
            {{comment.content}}
          </p>
          <section v-if='comment.reply_to'>
            <span class='to-username'>
              {{comment.reply_to.author}}:
            </span>
            {{comment.reply_to.content}}
          </section>
          <p class='comment-time'>
            {{ formatDate(comment.time,"yyyy年MM月dd日 hh时mm分ss秒") }}
          </p>
        </section>
      </article>
    </footer>
    <div v-show="scrollTopNum" class='backTop' @click="backTop"></div>
    <loading v-if="loading">
      加載中…
    </loading>
  </section>
</template>

<script>
import config from "../config";
import { formatDate } from "../utils";
import { debounce } from "lodash";
import Loading from "./loading";

export default {
  data() {
    return {
      contentData: {},
      mainWrap: null,
      storyExtra: {},
      longComments: [],
      shortComments: [],
      scrollTopNum: 0,
      url: config.url,
      formatDate: formatDate,
      loading: false
    };
  },
  created() {
    this.getContent(this.$route.params.contentID);
  },
  methods: {
    backPrevPage() {
      let isHome = JSON.parse(localStorage.getItem("isHome"));

      if (!isHome) {
        this.$emit("setIsHome", true);
      }

      this.$router.push("/");
    },
    async getContent(contentID) {
      // 新闻额外信息
      // console.log(contentID);
      // console.log(1)
      this.loading = true;

      let requset = (url, c) => {
        return fetch(url)
          .then(d => d.json())
          .then(td => {
            if (c) return c(td.data);
            return td.data;
          });
      };

      let comments = tempData => {
        console.log(tempData);
        let comments = tempData.comments.map(v => {
          return {
            ...v,
            time: parseInt((v.time += "000"))
          };
        });

        comments._len = tempData.comments.length;

        return comments;
      };

      this.storyExtra = await requset(
        this.url + "story-extra/" + contentID + "?revise=true",
        d => {
          return {
            content: d,
            _write: true
          };
        }
      );

      this.longComments = await requset(
        this.url + "story/" + contentID + "/long-comments" + "?revise=true",
        comments
      );

      this.shortComments = await requset(
        this.url + "story/" + contentID + "/short-comments" + "?revise=true",
        comments
      );

      this.contentData = await requset(
        this.url + "content/" + contentID + "?revise=true",
        d => {
          return {
            content: d,
            writeData: true
          };
        }
      );

      this.$nextTick(async () => {
        await this.getDom();
        await this.scrollDom();

        this.loading = false;
      });
    },
    getDom() {
      this.doms = {
        contentSection: document.querySelector("section.content"),
        contentWrap: document.querySelector("section.content main"),
        topThemeImg: document.querySelector(
          "section.content main section.top_theme"
        ),
        headerBar: document.querySelector("section.content>header")
      };
    },
    backTop() {
      this.buffer(document.documentElement, {
        scrollTop: 0
      });
    },
    goComment() {
      let { contentWrap } = this.doms;

      let scrollTop =
        contentWrap.offsetHeight + 50 + window.outerHeight >
        document.documentElement.scrollHeight
          ? document.documentElement.scrollHeight - window.outerHeight
          : contentWrap.offsetHeight + 50;

      this.buffer(document.documentElement, {
        scrollTop
      });
    },
    scrollDom() {
      let { contentSection, contentWrap, topThemeImg, headerBar } = this.doms;

      let _this = this;

      document.body.onmousewheel = document.body.ontouchstart = function() {
        clearInterval(document.body.buffer);

        let opacity = headerBar.style.opacity;

        if (opacity < 0 && headerBar.dataset._hide === "false") {
          headerBar.style.display = "none";
          headerBar.dataset._hide = true;
        } else if (opacity > 0 && headerBar.dataset._hide !== "false") {
          headerBar.style.display = "block";
          headerBar.dataset._hide = false;
        }
      };

      document.body.onscroll = debounce(
        () => {
          var top = document.documentElement.scrollTop;

          if (topThemeImg) {
            topThemeImg.style.transform =
              "translate3d(0," + 3 * top / 7 + "px,0)";
            topThemeImg.style.willChange = "transform";
          }

          let opacity = 1 - top / 220;

          if (opacity < 0 && headerBar.dataset._hide === "false") {
            headerBar.style.display = "none";
            headerBar.dataset._hide = true;
          } else if (opacity > 0 && headerBar.dataset._hide !== "false") {
            headerBar.style.display = "block";
            headerBar.dataset._hide = false;
          }

          headerBar.style.opacity = opacity > 0 ? opacity : 0;

          this.scrollTopNum = top;
        },
        1000 / 60,
        {
          leading: true
        }
      ).bind(this);
    },
    buffer(obj, parameter, callback) {
      //   缓冲运动框架
      clearInterval(obj.buffer);

      let _this = this;

      obj.buffer = setInterval(function() {
        obj.onOff = true;

        for (let attr in parameter) {
          let iCur,
            iTarget = parameter[attr]; //获取到目标值

          if (attr === "opacity")
            iCur = Math.round(_this.getNum(obj, attr) * 100);
          else iCur = parseInt(_this.getNum(obj, attr));

          let iSpeed = (iTarget - iCur) / 8;
          iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

          if (iCur != iTarget) {
            obj.onOff = false;

            if (attr === "opacity") {
              obj.style[attr] = (iSpeed + iCur) / 100;
              obj.style.filter = "alpha(opacity" + (iSpeed + iCur) + ")";
            } else {
              if (obj.style[attr] !== undefined) {
                obj.style[attr] = iSpeed + iCur + "px";
              } else if (obj[attr] !== undefined) {
                obj[attr] = iSpeed + iCur;
              }
            }
          }
        }

        if (obj.onOff) {
          callback && callback.call(obj);
          clearInterval(obj.buffer);
        }
      }, 30);
    },
    getNum(obj, attr) {
      if (obj.style[attr])
        return obj.currentStyle
          ? obj.currentStyle[attr]
          : getComputedStyle(obj, this)[attr];

      return obj[attr];
    }
  },
  components: {
    Loading
  }
};
</script>
