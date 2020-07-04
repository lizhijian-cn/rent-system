

module.exports = app => {
  const router = require('express').Router()
  const user = require('../controllsers/user.controller')

  router.post('/login', user.login)

  router.post('/register', user.register)
  
  router.get('/tenant', user.findAllTenant)
  
  router.route('/:id')
    .get(user.findOne)
    .put(user.update)

  app.use('/user', router)
}
