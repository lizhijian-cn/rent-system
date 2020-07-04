module.exports = app => {
  const router = require('express').Router()
  const complaint = require('../controllsers/complaint.controller')

  router.route('/')
    .get(complaint.findAll)
    .post(complaint.create)
  
  router.route('/:id')
    .get(complaint.findOne)
    .put(complaint.update)
    .delete(complaint.delete)

  app.use('/complaint', router)
}
