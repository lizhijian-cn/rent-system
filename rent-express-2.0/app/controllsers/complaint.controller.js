const db = require('../models')
const Complaint = db.complaint

exports.create = (req, res) => {
  const complaint = new Complaint(req.body)

  complaint.save().then(data => {
    res.json(data)
  }).catch(err => {
    res.status(600).json({
      message: err.message || "创建投诉失败"
    })
  })
}

exports.findOne = (req, res) => {
  Complaint.findById(id).then(data => {
    res.json(data)
  }).catch(err => {
    res.status(600).json({
      message: err.message || '获取投诉失败'
    })
  })
}

exports.findAll = (req, res) => {
  const { page = 1, limit = 20 } = req.query
  Complaint.find().then(async data => {
    const promiseList = data.filter((x, index) => index < limit * page && index >= limit * (page - 1))
    const pageList = await Promise.all(promiseList)
    res.json({
      total: data.length,
      items: pageList
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id
  Complaint.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
    if (!data) {
      res.status(600).json({ message: '投诉id不存在'})
      return
    }
  }).catch(err => {
    res.status(600).json({ message: err.message || '更新投诉错误' })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id
  Complaint.findByIdAndRemove(id).then(data => {
    if (!data) {
      res.status(600).json({ message: '投诉id不存在'})
      return
    }
  }).catch(err => {
    res.status(600).json({ message: err.message || '删除投诉错误' })
  })
}