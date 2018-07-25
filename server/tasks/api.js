// http://api.douban.com/v2/movie/subject/1764796

const rp = require('request-promise-native')

async function fetchMovie (item){
  const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`
  const res = await rp(url)
  return res
}

;(async ()=>{
  let movies = [
  { 
    doubanId: 30188120,
    title: '中餐厅 第二季',
    rate: 7,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2527167540.jpg' 
  },
  { 
    doubanId: 26785790,
    title: '沙海',
    rate: 6.8,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2527072332.jpg' 
  }]

  movies.map(async movie => {
    let movieData = await fetchMovie(movie)
    try{
      movieData = JSON.parse(movieData)
      console.log(movieData)
    }catch(err){
      console.log(err)
    }
    console.log(movieData)
  })
})()

