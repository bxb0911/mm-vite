#! /usr/bin/env node
// 可以运行的脚本

// 需要通过http启动一个模块，内部基于Koa
// es-module-lexer koa koa-static magic-string
const createServer = require("../index");

// 创建一个Koa服务
createServer().listen(4000, () => {
  console.log("Server start 4000 port", "http://localhost:4000");
});
