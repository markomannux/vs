var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Appointment.find((err, appointments) => {
    if (err) {
      console.log(err);
    }

    res.render('calendar/index', {
      title: 'Calendario',
      appointments: appointments
    });
  })
});

module.exports = router;
