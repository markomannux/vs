var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');
const Room = require('../model/room');


router.get('/', async function(req, res, next) {
  const rooms = await Room.find();
  if (req.accepts('json')) {
    return res.json(rooms);
  }
  res.render('rooms', {rooms: rooms});
});

router.get('/:id', function(req, res, next) {
  Appointment.find({
    room: req.params.id
  },(err, appointments) => {
    res.render('room', {
      title: 'Room',
      planned: appointments
    });
  })
});

router.post('/', async function(req, res, next) {
  const room = new Room(req.body);
  await room.save()
  res.redirect('/rooms');
});


module.exports = router;