const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
      type: String
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  rooms: [
      { type: Schema.Types.ObjectId, ref: 'Room' }
    ],
  roles: [String]
})

const User = mongoose.model('User', userSchema);

module.exports = User;