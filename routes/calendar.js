var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const appointments = await Appointment.find().sort({date: 1})
  res.render('calendar/index', {
    title: 'Calendario',
    appointments: appointments
  });
});

module.exports = router;
