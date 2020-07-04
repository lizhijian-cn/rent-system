module.exports = app => {
  const router = require('express').Router()
  const room = require('../controllsers/room.controller')

  router.route('/')
    .get(room.findAll)
    .post(room.create)
  
  router.route('/:id')
    .get(room.findOne)
    .put(room.update)
    .delete(room.delete)

  app.use('/room', router)
}
