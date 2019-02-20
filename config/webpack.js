const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const {
  WebpackBundleSizeAnalyzerPlugin
} = require("webpack-bundle-size-analyzer");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const webpackConfig = {
  devtool: "#source-map",
  entry: {
    index: "./src/main.js",
    vendor: ["vue", "vuex", "vue-router", "babel-polyfill"]
  },
  output: {
    path: path.join(__dirname, "..", "dist"),
    publicPath: "/",
    filename: "js/[name].[chunkhash].js"
  },
  resolve: {
    extensions: ["*", ".js", ".vue", ".css", ".scss", ".sass", ".png"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {
            scss: ExtractTextPlugin.extract({
              fallback: "vue-style-loader",
              use: ["css-loader", "postcss-loader", "sass-loader"]
            })
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "./img/[name].[hash:9].[ext]"
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader"]
        })
        // loader: ExtractTextPlugin.extract("style", "css!postcss")
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader", "sass-loader"]
        }),
        exclude: /node_modules/
        // loader: ExtractTextPlugin.extract("style", "css!postcss!sass")
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      // 压缩loader
      minimize: true,
      options: {
        postcss: function() {
          return [
            require("autoprefixer")({
              browsers: ["ie>=8", ">1% in CN", "iOS>=7"]
            })
          ];
        }
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // new ExtractTextPlugin("../css/[name].[chunkhash:8].css"),
    new ExtractTextPlugin("css/[name].[hash].css"),
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "知乎日报",
      template: "./index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: "dependency"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // sever or static or disabled
      reportFilename: "report.html",
      openAnalyzer: false,
      logLevel: "info"
    }),
    new WebpackBundleSizeAnalyzerPlugin("./report-plain.txt"),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: path.resolve(__dirname, "../dist"),
        ignore: [".*"]
      }
    ])
  ]
};

module.exports = webpackConfig;
