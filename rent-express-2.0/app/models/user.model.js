const { mongo } = require("mongoose");

module.exports = mongoose => {
  const User = mongoose.model(
    'User',
    mongoose.Schema(
      {
        role: String,
        username: String,
        password: String,
        email: String,
        activated: Boolean,
        balance: Number,
        name: String,
        address: String,
        telephone: String
      },
      {
        timestamps: true
      }
    )
  )
  return User
}