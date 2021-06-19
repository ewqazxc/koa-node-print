const Koa = require("koa");
const cors = require("koa2-cors");
const Router = require("koa-router");
const NodePrint = require('./src/nodePrint');

const router = new Router();
const app = new Koa();
const { printPdfByUrl } = NodePrint;

// 允许跨域
app.use(cors());
// 启动路由
app.use(router.routes()).use(router.allowedMethods());

router.get("/printPdfByUrl", async (ctx) => {
  console.log('ctx.query::', ctx.query);
  const { pdfUrl } = ctx.query;
  const res = await printPdfByUrl(pdfUrl);
  console.log('res::', res);
  ctx.body = res;
});

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// response

app.use(async (ctx) => {
  ctx.body = "Hello World";
});

app.listen(38001);
console.log('Server is listenning in 127.0.0.1:38001 ...');
