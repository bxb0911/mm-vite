const { readBody } = require("./utils");
const { parse } = require("es-module-lexer"); // 解析import语法的
const MagicString = require("magic-string"); //因为字符串具有不变性

function rewriteImports(source) {
  let imports = parse(source)[0];
  let strObj = new MagicString(source); // overwrite(s, e)
  if (imports.length) {
    // 对import语法进行拦截
    // 说明有多条import语法
    for (let i = 0; i < imports.length; i++) {
      let { s, e } = imports[i];
      let id = source.substring(s, e); // vue ./App
      // 当前开头是 \ 或者 . 不需要重写
      if (/^[^\/\.]/.test(id)) {
        id = `/@modules/${id}`; // 标识这个模块是第三方模块
        strObj.overwrite(s, e, id);
      }
    }
  }
  return strObj.toString(); // 将替换后的结果返回 增加/@module 浏览器会再次发送请求，服务器要拦截带有 /@modules 前缀的请求进行处理
}

function moduleRewritePlugin({ app, root }) {
  // 启动项目时的根路径
  app.use(async (ctx, next) => {
    await next(); // ctx.body = fs.readFile('./xxx')
    // 在这里完善了自己的逻辑，洋葱模型

    // 获取流中的数据
    if (ctx.body && ctx.response.is("js")) {
      let content = await readBody(ctx.body);
      // 重写内容 将重写后的内容返回回去
      const result = rewriteImports(content);

      ctx.body = result; // 将内容重写并且返回
    }
  });
}

exports.moduleRewritePlugin = moduleRewritePlugin;
