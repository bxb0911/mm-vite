const moduleReg = /^\/@modules\//;
const fs = require("fs").promises;
const { resolveVue } = require("./utils");

function moduleResolvePlugin({ app, root }) {
  const vueResolved = resolveVue(root); // 根据当前运行vite的目录解析出一个文件表来，包含着vue中的所有的模块

  app.use(async (ctx, next) => {
    if (!moduleReg.test(ctx.path)) {
      // 处理当前请求的路径，是否以/@modules开头的
      return next();
    }
    // 将 /@modules 替换掉
    const id = ctx.path.replace(moduleReg, ""); // vue

    ctx.type = "js"; // 设置响应类型，响应的结果是js类型
    // 应该去当前项目下找到vue对应的真是的文件
    const content = await fs.readFile(vueResolved[id], "utf8");
    ctx.body = content; // 返回读取出来的结果
  });
}

exports.moduleResolvePlugin = moduleResolvePlugin;
