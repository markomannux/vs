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
  start: {
      type: Date
  },
  end: {
      type: Date
  },
  notes: {
      type: String
  },
  finished: {
      type: Boolean
  }

})

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;