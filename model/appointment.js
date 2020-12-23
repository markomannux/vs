const mongoose = require('mongoose');
const Room = require('./room');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  summary: {
    type: String,
    required: true
  },
  contact: {
    type: Schema.Types.ObjectId, ref: 'Contact',
    required: true
  },
  room: {
    type: Schema.Types.ObjectId, ref: 'Room',
    required: true
  },
  start: {
    type: Date,
    required: true
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