var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');

router.get('/', function(req, res, next) {

  Appointment.find((err, appointments) => {
    res.render('room', {
      title: 'Room',
      planned: appointments
    });
  })
});

module.exports = router;
