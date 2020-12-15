var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');
const dateUtils = require('../utils/date-utils')

router.post('/', async function(req, res, next) {
    let appointment = new Appointment(req.body);
    if (!appointment.end) {
        appointment.end = dateUtils.addMinutes(appointment.start, 30)
    }
    appointment = await appointment.save();
    const redirectTo = req.query.redirectTo || '/calendar'
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: redirectTo});
});

router.get('/:id/waitingroom', async function(req, res, next) {
    let appointment = await Appointment.findById(req.params.id);

    if (appointment.finished) {
        return res.render('waiting_room/finished', {
            title: "Concluso",
            appointment
        })
    }

    res.render('waiting_room/index', {
        title: "Sala d'attesa",
        appointment
    });
})

router.delete('/:id', async function(req, res, next) {
    let appointment = await Appointment.findById(req.params.id);
    await appointment.remove()
    const redirectTo = req.query.redirectTo || '/calendar'
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: redirectTo});
});

module.exports = router;