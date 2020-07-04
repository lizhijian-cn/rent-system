const db = require('../models')
const Room = db.rooms

exports.create = (req, res) => {
  const room = new Room(req.body)

  room.save().then(data => {
    res.json(data)
  }).catch(err => {
    res.status(600).json({
      message: err.message || "创建房间失败"
    })
  })
}

exports.findOne = (req, res) => {
  const id = req.params.id
  Room.findById(id).then(data => {
    res.json(data.vm())
  }).catch(err => {
    res.status(600).json({
      message: err.message || '获取用户失败'
    })
  })
}

exports.findAll = (req, res) => {
  const { page = 1, limit = 20 } = req.query
  Room.find().then(data => {
    const pageList = data.filter((x, index) => index < limit * page && index >= limit * (page - 1)).map(x => x.vm())
    res.json({
      total: data.length,
      items: pageList
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id
  console.log(id)
  Room.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
    console.log(data)
    if (!data) {
      res.status(600).json({ message: '房间id不存在'})
      return
    }
    res.json(data.vm())
  }).catch(err => {
    res.status(600).json({ message: err.message || '更新房间错误' })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id
  Room.findByIdAndRemove(id).then(data => {
    if (!data) {
      res.status(600).json({ message: '房间id不存在'})
      return
    }
  }).catch(err => {
    res.status(600).json({ message: err.message || '删除房间错误' })
  })
}