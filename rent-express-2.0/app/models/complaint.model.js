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

  // Schema.methods = {
  //   vm: function() {
  //     this.status = this.repaired
  //     ? 2
  //     : this.lived < this.type
  //     ? 0
  //     : 1
  //     this.rent = (40 + this.additionService.length * 20) / this.type
  //     return this
  //   }
  // }
  return mongoose.model('Complaint', Schema)
}