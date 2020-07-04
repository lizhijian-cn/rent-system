const db = require('../models')
const Jwt = require('../utils/jwt')
const User = db.users

const create = (req, res) => {
  const { role, username, password, email, name, address, telephone } = req.body
  const user = new User({
    role,
    username,
    password,
    email,
    name,
    address,
    telephone,
    activated: false,
    balance: 0
  })

  user.save().then(data => {
    res.json(data)
  }).catch(err => {
    res.status(600).json({
      message: err.message || "创建用户失败"
    })
  })
}

exports.register = (req, res) => {
  const { username } = req.body
  User.findOne({ username }).then(result => {
    if (result) {
      res.status(600).json({ message: '用户名已存在'})
      return 
    }
    create(req, res)

  }).catch(err => {
    res.status(600).json({
      message: err.message || '注册用户失败'
    })
  })
}

exports.login = (req, res) => {
  const { username, password } = req.body
  User.findOne({ username, password }).then(result => {
    if (!result) {
      res.status(600).json({ message: '账户密码错误' })
      return
    }
    const _id = result._id
    const jwt = new Jwt(_id)
    const token = jwt.generateToken()
    res.json({ token })
  }).catch(err => {
    res.status(600).json({
      message: err.message || '登录失败'
    })
  })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  User.findById(id).then(data => {
    res.json(data)
  }).catch(err => {
    res.status(600).json({
      message: err.message || '获取用户失败'
    })
  })
}

exports.findAllTenant = (req, res) => {
  const { page = 1, limit = 20 } = req.query
  User.find({ role: 'tenant' }).then(data => {
    const pageList = result.filter((x, index) => index < limit * page && index >= limit * (page - 1))
    res.json({
      total: data.length,
      items: pageList
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id
  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
    if (!data) {
      res.status(600).json({ message: '用户id不存在'})
      return
    }
  }).catch(err => {
    res.status(600).json({ message: err.message || '更新用户错误' })
  })
}