module.exports = app => {
  const router = require('express').Router()
  const apply = require('../controllsers/apply.controller')

  router.route('/')
    .get(apply.findAll)
    .post(apply.create)
  
  router.route('/:id')
    .get(apply.findOne)
    .put(apply.update)
    .delete(apply.delete)
  
  app.use('/apply', router)
}
