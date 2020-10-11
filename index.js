const Koa = require("koa");
const { serveStaticPlugin } = require("./plugins/serverPluginServeStatic");
const { moduleRewritePlugin } = require("./plugins/serverPluginModuleRewrite");
const { moduleResolvePlugin } = require("./plugins/serverPluginModuleResolve");
const { htmlRewritePlugin } = require("./plugins/serverPluginHtmlRewrite");
const { vuePlugin } = require("./plugins/serverPluginVue");

function createServer() {
  const app = new Koa(); // 创建一个koa实例
  const root = process.cwd(); // 进程运行的工作目录
  // 当用户运行 npm run mm-dev时，会创建服务
  // Koa是基于中间件来运行的
  const context = {
    app,
    root,
  };

  const resolvedPlugins = [
    // 插件的集合

    // 4）解析HTML
    htmlRewritePlugin,

    // 2) 解析import，重写路径
    moduleRewritePlugin,

    // 3）解析以 /@modules 文件开头的内容，找到对应的结果
    moduleResolvePlugin,

    // 5）解析vue
    vuePlugin,

    // 1）要实现静态服务的功能
    serveStaticPlugin, // 功能是读取文件将文件结果放到了ctx.body上
  ];

  resolvedPlugins.forEach((plugin) => plugin(context));
  return app;
}

module.exports = createServer;
