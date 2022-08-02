const path = require("path");
const webpack = require("webpack");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  runtimeCompiler: true,
  devServer: {
    port: 8088,
    proxy: {
      "": {
        //所有以这个开头的地址都会被代理到下面这个域
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true,
      },
    },
  },
  // runtimeCompiler: true, // 运行时编译
  //代码保存时进行eslint检测
  lintOnSave: false,
  //是否在构建生产包时生成sourceMap文件，false将提高构建速度
  productionSourceMap: false,
  //打包build
  //基本路径
  publicPath: "/", //默认的'/'是绝对路径，如果不确定在根路径，改成相对路径'./'
  // 输出文件目录
  outputDir: "dist",
  assetsDir: "static",
  indexPath: "index.html",
  //svg配置
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    // lodash
    config.plugin("provide").use(webpack.ProvidePlugin, [
      {
        _: "lodash",
      },
    ]);
  },
};
