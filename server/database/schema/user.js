const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000
const Schema = mongoose.Schema
// const Mixed = Schema.Types.Mixed

const userSchema = new Schema({
  username: {
    unique: true,
    required: true,
    type: String,
  },
  email: {
    unique: true,
    required: true,
    type: String,
  },
  password: {
    unique: true,
    type: String,
  },
  lockUntil: Number,
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updateAt:{
      type: Date,
      default: Date.now()
    }
  }
})
userSchema.virtual('isLocked').get(function(){
  return !!(this.lockUntil && this.lockUntil > Date.now())
})
//保存之前更新一下创建时间和更新时间
userSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else{
    this.meta.updateAt = Date.now()
  }
  next()
})

userSchema.pre('save', function(next) {
  if(!this.isModified('password')) return next()

  bcrypt.gensalt(SALT_WORK_FACTOR, (err, salt) => {
    if(err) return next(err)

    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
  if (this.isNew) {
    this.meta.createdAt = this.meta.updateAt = Date.now()
  } else{
    this.meta.updateAt = Date.now()
  }
  next()
})

userSchema.methods = {
  //_password代表传进来的铭文密码，password代表数据库加盐加密的密码
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },
  incLoginAttempts: (user) => {
    return new Promise((resolve, reject) => {
      //有锁定时间但是锁定时间失效（锁定时间超过了当前时间）的情况下
      if(this.lockUntil && this.lockUntil < Date.now()){
        this.update({
          $set: {loginAttempts: 1},
          $unset:{lockUntil: 1}
        },(err) => {
          if(!err) resolve(true)
          else reject(err)
        })
      }else{
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }
        //未被锁定并且尝试次数超过了5次，则锁定（设置锁定时间为当前时间+两小时）
        if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked){
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }
        this.update(updates, err => {
          if(!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

mongoose.model('User', userSchema)