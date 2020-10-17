const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
      type: String
  },
  name: {
    type: String
  },
  rooms: [
      { type: Schema.Types.ObjectId, ref: 'Room' }
    ]
})

const User = mongoose.model('User', userSchema);

module.exports = User;