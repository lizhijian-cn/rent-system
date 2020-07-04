const db = require('../models')
const User = db.users
const Room = db.rooms
const Apply = db.applies

async function vm(x) {
  const vmx = x.toObject()
  const user = await User.findById(x.userId).exec()
  const room = await Room.findById(x.roomId).exec()
  vmx.username = user.username
  vmx.roomNumber = room.roomNumber
  return vmx
}

exports.create = (req, res) => {
  const apply = new Apply(req.body)

  apply.save().then(data => {
    res.json(data)
  }).catch(err => {
    res.status(600).json({
      message: err.message || "创建订单失败"
    })
  })
}

exports.findOne = (req, res) => {
  Apply.findById(id).then(data => {
    res.json(vm(data))
  }).catch(err => {
    res.status(600).json({
      message: err.message || '获取订单失败'
    })
  })
}

exports.findAll = (req, res) => {
  const { page = 1, limit = 20 } = req.query
  Apply.find().then(async data => {
    const promiseList = data.filter((x, index) => index < limit * page && index >= limit * (page - 1)).map(vm)
    const pageList = await Promise.all(promiseList)
    res.json({
      total: data.length,
      items: pageList
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id
  Apply.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
    if (!data) {
      res.status(600).json({ message: '订单id不存在'})
      return
    }
  }).catch(err => {
    res.status(600).json({ message: err.message || '更新订单错误' })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id
  Apply.findByIdAndRemove(id).then(data => {
    if (!data) {
      res.status(600).json({ message: '订单id不存在'})
      return
    }
  }).catch(err => {
    res.status(600).json({ message: err.message || '删除订单错误' })
  })
}