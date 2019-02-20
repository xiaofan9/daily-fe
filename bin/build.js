const webpack = require("webpack");
const ora = require("ora");
const webpackConfig = require("../config/webpack.js");
const chalk = require("chalk");
const rm = require("rimraf");
const path = require("path");
const fs = require("fs-extra");

const spinner = ora(chalk.cyan("开始打包文件..."));
spinner.start();

rm(path.join(__dirname, "..", "dist"), err => {
    if (err) throw err;

    webpack(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) {
            console.error(err.stack || err);
            if (err.details) console.error(err.details);
            return;
        }

        const info = stats.toString({
            colors: true, // 在控制台展示颜色
            modules: false, // 使构建过程更静默无输出
            children: false,
            chunks: false,
            chunkModules: false,
        });

        if (stats.hasErrors())
            console.error(info.errors);

        if (stats.hasWarnings())
            console.warn(info.warnings);

        console.log(info + "\r\n");

        console.log(chalk.red("文件打包成功！打包输出的文件在dist目录下")); // chalk 模块使用方式

        // ["css", "js", "img"].forEach(v => {
        //     rm("../api/public/" + v, err => {
        //         if (err) throw err;

        //         setTimeout(() => fs.copy("dist/" + v + "/", "../api/public/" + v + "/")
        //             .catch(err => console.error(err)),300);
        //     });
        // });
    });
});
