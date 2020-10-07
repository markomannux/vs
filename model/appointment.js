const mongoose = require('mongoose');
const Room = require('./room');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  summary: {
    type: String
  },
  contact: {
      type: Schema.Types.ObjectId, ref: 'Contact'
  },
  room: {
      type: Schema.Types.ObjectId, ref: 'Room'
  },
  date: {
      type: String
  },
  notes: {
      type: String
  },

})

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;