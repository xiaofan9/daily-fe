const express = require("express"); // 引入 express
const webpack = require("webpack"); // webpack
const webpackConfig = require("../config/webpack.dev.js"); // 引入webpack 配置文件
const path = require("path");
const chalk = require("chalk");
const opn = require("opn");

const app = express();
const proxyMiddleware = require("http-proxy-middleware");

const devClient = "./config/dev-client"; // 指定配置文件位置
Object.keys(webpackConfig.entry).forEach((name, i) => {
    webpackConfig.entry[name] = [devClient].concat(webpackConfig.entry[name]); // [devClient,原来的]
});

const proxyTable = webpackConfig.proxyTable;

delete webpackConfig.proxyTable;

// 调用配置,生成 compiler instance
// 关于compiler，具体查看https://zhuanlan.zhihu.com/p/20929843?refer=jscss
const compiler = webpack(webpackConfig);

// 使用 webpack-dev-middleware 将 webpack 转换成 express 的中间件
const devMiddleware = require("webpack-dev-middleware")(compiler, {
    publicPath: webpackConfig.output.publicPath, // 中间件的公共路径，应该和webpack的路径相同
    quiet: true, // 不向控制台显示任何内容
    // noInfo: true, // 控制台不显示输出信息（只输出错误和警告信息）
    // lazy: true, // 懒加载模式，不监听文件，但是在请求时会编译文件
    // watchOptions: { // 监听选项，只有当lazy:false 有效
    //     aggregateTimeout: 300,
    //     poll: true,
    // },
    // index: "index.html", // 服务器索引路径
    // headers: { // 定义头部信息
    //     "X-Custom-Header": "yes",
    // },
    // stats: { // 详情参考 http://www.css88.com/doc/webpack2/configuration/stats/
    //     colors: true,
    // },
    // reporter: null, // 定义日志显示的方式
    // serverSideRender: false, // 关闭服务端渲染模式
});

const hotMiddleware = require("webpack-hot-middleware")(compiler, {
    log: false,
});

compiler.plugin("compilation", function(compilation) {
    compilation.plugin("html-webpack-plugin-after-emit", function(data, cb) {
        hotMiddleware.publish({
            action: "reload",
        });
        cb();
    });
});

// 响应 html5 history api
app.use(require("connect-history-api-fallback")());

// 代理
// Object.keys(proxyTable).forEach(function(context) {
//     let options = proxyTable[context];
//     if (typeof options === "string") {
//         options = {
//             target: options,
//         };
//     }
//     app.use(proxyMiddleware(options.filter || context, options));
// });

app.use(hotMiddleware);

app.use(devMiddleware);

// 使用静态资源
app.use("/microHealth", express.static(path.join(__dirname, "/")));
app.use(express.static(path.join(__dirname, "/")));
app.use(express.static("./static"));

const port = 8090;

console.log(chalk.cyan("> 启动开发环境服务器..."));

devMiddleware.waitUntilValid(() => {
    let url = "http://localhost:" + port;
    console.log("> 监听地址： " + chalk.red(url) + "\n");
    opn(url);
});

app.listen(port);
