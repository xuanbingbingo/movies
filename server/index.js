const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = '首页'
})
app.listen(3000)