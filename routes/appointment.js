var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');
const dateUtils = require('../utils/date-utils')
const WaitingListService = require('../services/waiting-list');

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

router.post('/:id/start', async (req, res, next) => {
    console.log('starting conference', req.params.id);
    const appointment = await Appointment.findById(req.params.id);
    WaitingListService.setAsCurrentAppointment(appointment)
    res.send('')
})

router.post('/:id/end', async (req, res, next) => {
    console.log('ending conference', req.params.id);
    const appointment = await Appointment.findById(req.params.id);
    WaitingListService.clearCurrentAppointment(appointment.room._id)
    res.send('')
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