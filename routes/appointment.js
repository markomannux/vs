var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');

router.post('/', async function(req, res, next) {
    let appointment = new Appointment(req.body);
    appointment = await appointment.save();
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {appointment: appointment, redirect: "/contacts"});
});

router.delete('/:id', async function(req, res, next) {
    Appointment.findById(req.params.id);
    appointment = await appointment.delete((err, data) => {
        res.redirect('calendar');
    });
});

module.exports = router;