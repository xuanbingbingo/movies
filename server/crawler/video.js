
const puppeteer = require('puppeteer')
const base = "https://movie.douban.com/subject/"
const doubanId = "26654498"
const videoBase = "https://movie.douban.com/trailer/26654498"
const sleep = time => new Promise(resolve=>{
  setTimeout(resolve,time)
})


//自动执行的异步函数
;(async ()=>{
  console.log('Start visit the target page')

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })

  const page = await browser.newPage()
  await page.goto(base + doubanId,{
    waitUntil: 'networkidle2'
  })
  await sleep(100)

  const result = await page.evaluate(() =>{
    var $ = window.$
    var it = $('.related-pic-video')
    

    if(it && it.length > 0){
      var link = it.attr('href')
      var cover = it.attr('style').match(/https(\S*)jpg/g)[0]

      return {
        link,
        cover
      }
    }

    return {}
  })
  //继续爬取
  let video

  if(result.link){
    await page.goto(result.link,{
      waitUntil:'networkidle2'
    })
    await sleep(2000)

    video = await page.evaluate(()=>{
      var $ = window.$
      var it = $('source')
      if(it && it.length>0){
        return it.attr('src')
      }
      return ''
    })
  }

  const data = {
    video,
    doubanId,
    cover: result.cover
  }
  browser.close()
  process.send(data)
  process.exit(0)
})()