const dbConfig = require('../config/db.config')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {
  mongoose,
  url: dbConfig.url,
  users: require('./user.model')(mongoose),
  rooms: require('./room.model')(mongoose),
  applies: require('./apply.model')(mongoose),
  complaint: require('./complaint.model')(mongoose),
  ticket: require('./ticket.model')(mongoose)
}

module.exports = db