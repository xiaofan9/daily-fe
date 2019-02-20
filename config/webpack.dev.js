const path = require("path");
const opn = require("opn");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin"); // 格式化输出命令行
// NodeJS中的Path对象，用于处理目录的对象，提高开发效率。
// 模块导入

// console.log(path.join(__dirname, '../static'));
module.exports = {
  // 入口文件地址，不需要写完，会自动查找
  devtool: "#cheap-module-eval-source-map",
  entry: {
    index: "./src/main.js"
  },
  // 输出
  output: {
    path: path.join(__dirname, "..", "dev"),
    // 文件地址，使用绝对路径形式
    publicPath: "/",
    filename: "[name].js"
    //[name]这里是webpack提供的根据路口文件自动生成的名字
  },
  devServer: {
    // webpack-dev-server 配置项
    // 服务器根目录
    port: 8090,
    hot: true,
    inline: true,
    clientLogLevel: "none",
    historyApiFallback: true, // 当使用HTML5 History API，任意的 404 响应可以提供为 index.html 页面。
    host: "0.0.0.0",
    quiet: true,
    noInfo: true // 启用 noInfo 后，诸如「启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏。错误和警告仍然会显示。
    // proxy: {
    //   "/api": {
    //     target: "http://127.0.0.1:7000",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/api": "/v1/daily"
    //     }
    //   }
    // }
  },
  resolve: {
    // 解析
    extensions: ["*", ".js", ".vue", ".css", ".scss", ".png"],
    // aliasFields: ["browser"] 指定解析规范
    alias: {
      // 创建 import 或 require 的别名，来确保模块引入变得更简单。
      // vue$: "vue/dist/vue.common.js" // 在给定对象的键后的末尾添加 $，以表示精准匹配
      vue$: "vue/dist/vue.esm.js"
    }
  },
  // 加载器
  module: {
    // 加载器
    rules: [
      // loader ---> rules
      // 转化ES6的语法
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
        // enforce: "pre", // 在babel-loader对源码进行编译前进行lint的检查
      },
      // 解析.vue文件
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: ["vue-style-loader", "css-loader", "sass-loader"]
          }
        }
        // enforce: "pre", // 在babel-loader对源码进行编译前进行lint的检查
        // include: /src/, // src文件夹下的文件需要被lint
        // use: [{
        //     loader: "eslint-loader",
        //     options: {
        //         formatter: require("eslint-friendly-formatter") // 编译后错误报告格式
        //     }
        // }, {
        //     loader: "vue-loader",
        //     options: {
        //         loaders: {
        //             scss: ["vue-style-loader", "css-loader", "sass-loader"]
        //         }
        //     }
        // }],
        // exclude: /node_modules/, // 可以不用定义这个字段的属性值，eslint会自动忽略node_modules和bower_
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "file-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"] //  loaders ---> use
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // 取消了在模块名中自动添加 -loader 后缀 style ---> style-loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      // 不要加hash值，会出现每次更新触发页面更新
      filename: "index.html",
      template: "index.html",
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
};
