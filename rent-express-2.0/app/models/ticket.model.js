const { mongo } = require("mongoose");

module.exports = mongoose => {
  const Schema = mongoose.Schema(
    {
      userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
      
      content: String,
      replied: { type: Boolean, default: false },
      reply: { type: String, default: '' }
    },
    {
      timestamps: true
    }
  )

  return mongoose.model('Ticket', Schema)
}