const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const mongoose = require('mongoose')
const { resolve } = require('path')
const { connect, initSchemas } = require('./database/init')

;(async () => {
  await connect()

  initSchemas()

  require('./tasks/api')

  // const Movie = mongoose.model('Movie')

  // const movies = await Movie.find({})

  // console.log('movies',movies)
})()

app.use(views(resolve(__dirname,'./views'),{
  extension: 'pug'
}))
app.use(async (ctx, next) => {
  await ctx.render('index',{
    you:'bingo',
    me:'电影首页'
  })
})
app.listen(3000)