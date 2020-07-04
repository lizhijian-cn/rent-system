const { mongo } = require("mongoose");

module.exports = mongoose => {
  const Schema = mongoose.Schema(
    {
      roomNumber: String,
      type: Number,
      lived: { type: Number, default: 0 },
      additionService: [String],
      repaired: { type: Boolean, default: false },
    },
    {
      timestamps: true
    }
  )

  Schema.methods = {
    vm: function() {
      this.status = this.repaired
      ? 2
      : this.lived < this.type
      ? 0
      : 1
      this.rent = (40 + this.additionService.length * 20) / this.type
      return this
    }
  }
  return mongoose.model('Room', Schema)
}