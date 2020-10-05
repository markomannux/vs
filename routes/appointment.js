var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');

/* GET users listing. */
router.post('/', async function(req, res, next) {
    console.log(req.body)
    let appointment = new Appointment(req.body);
    appointment = await appointment.save();
    res.render('appointment', {appointment: data});
});

module.exports = router;