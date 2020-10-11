const path = require("path");
const { Readable } = require("stream");

async function readBody(stream) {
  // Koa 中要求所有异步方法必须包装成promise
  if (stream instanceof Readable) {
    // 只对流文件进行处理
    return new Promise((resolve, reject) => {
      let res = "";
      stream.on("data", (data) => {
        res += data;
      });
      stream.on("end", () => {
        resolve(res); // 将解析结果返回回去
      });
    });
  } else {
    return stream.toString();
  }
}

function resolveVue(root) {
  // vue3由几部分组成  runtime-dom  runtime-core compiler compiler-core compiler-sfc reactivity shared
  // 在后端解析vue文件
  // 编译是在后端实现的，所以要拿到的文件是commonjs规范的
  const compilerPkgPath = path.join(
    root,
    "node_modules",
    "@vue/compiler-sfc/package.json"
  );
  const compilerPkg = require(compilerPkgPath); // 获取json中的内容
  const compilerPath = path.join(
    path.dirname(compilerPkgPath),
    compilerPkg.main
  );
  const resolvePath = (name) =>
    path.resolve(
      root,
      "node_modules",
      `@vue/${name}/dist/${name}.esm-bundler.js`
    );

  const runtimeDomPath = resolvePath("runtime-dom");
  const runtimeCorePath = resolvePath("runtime-core");
  const reactivity = resolvePath("reactivity");
  const shared = resolvePath("shared");
  // esmModule模块

  return {
    compiler: compilerPath, // 用于稍后后端进行编译的文件路径
    "@vue/runtime-dom": runtimeDomPath,
    "@vue/runtime-core": runtimeCorePath,
    "@vue/reactivity": reactivity,
    "@vue/shared": shared,
    vue: runtimeDomPath,
  };
}

exports.readBody = readBody;
exports.resolveVue = resolveVue;
