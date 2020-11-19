var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');

router.get('/', async (req, res, next) => {
  switch (req.accepts(['json', 'html'])) {
    case 'html':
      res.render('calendar/index', {
        title: 'Calendario',
      });
      break
    case 'json':
      const appointments = await Appointment.find().populate('contact').sort({date: 1})
      res.json(appointments);
      break
  }
});

module.exports = router;
