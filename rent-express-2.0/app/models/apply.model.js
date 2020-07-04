const { mongo } = require("mongoose");

module.exports = mongoose => {
  const Schema = mongoose.Schema(
    {
      userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
      roomId: { type: mongoose.Schema.ObjectId, ref: 'Room' },
      rentType: String,
      startDay: Date,
      time: Number,
      passed: { type: Boolean, default: false },
      payed: { type: Boolean, default: false }
    },
    {
      timestamps: true
    }
  )
  return mongoose.model('Apply', Schema)
}