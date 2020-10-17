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

router.get('/:id/waitingroom', async function(req, res, next) {
    let appointment = await Appointment.findById(req.params.id);
    console.log(`Sending to waiting room for appointment ${appointment.id}: room ${appointment.room}`);
    res.render('waitingroom', {appointment});
})

router.delete('/:id', async function(req, res, next) {
    let appointment = await Appointment.findById(req.params.id);
    appointment = await appointment.remove((err, data) => {
        res
        .set('Content-Type', 'application/javascript')
        .render('js/redirect', {redirect: "/calendar"});
    });
});

module.exports = router;