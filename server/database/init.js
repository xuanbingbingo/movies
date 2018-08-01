const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-trailer'
const glob = require('glob')
const { resolve } = require('path')
mongoose.Promise = global.Promise

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}
exports.connect = () => {
  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production'){
      mongoose.set('debug', true)
    }
  
    mongoose.connect(db)
  
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if(maxConnectTimes < 5){
        mongoose.connect(db,{
          useNewUrlParser: true
        })
      } else{
        throw new Error('数据库挂了')
      }
     
    })
  
    mongoose.connection.on('error', err => {
      reject(err)
      console.log(err)
    })
    
    // mongoose.connection.once('open', ()=> {
      //第一步：创建schema
      // const DogSchema = mongoose.Schema({
      //   name: String
      // });
      //第二步：根据schema创建model
      // const Dog = mongoose.model('Dog', DogSchema)
      //第三步： 根据model创建collection文档
      // const doga = new Dog({name: '阿尔法'})
      //第四步：保存文档到磁盘
      // doga.save().then(() => {
      //   console.log('wang')
      // })
    // })
    mongoose.connection.on('open', err => {
      resolve()
      console.log('MongoDB Connected successfully!')
    })
  })
  
}