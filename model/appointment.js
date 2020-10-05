const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  summary: {
    type: String
  },
  contact: {
      type: Schema.Types.ObjectId, ref: 'Contact'
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