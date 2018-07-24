const Koa = require('koa')
const app = new Koa()
const { htmlTpl,ejsTpl } = require('./tpl/index')
const ejs = require('ejs')

app.use(async (ctx, next) => {
  ctx.type = 'text/html; charset=utf-8'
  ctx.body = ejs.render(ejsTpl,{
    first:'bingo',
    second:'电影首页'
  })
})
app.listen(3000)