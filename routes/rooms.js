var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');
const Room = require('../model/room');
const WaitingListService = require('../services/waiting-list');

router.get('/', async function(req, res, next) {
  const rooms = await Room.find();
  if (req.accepts('application/json')) {
    return res.json(rooms);
  }
  res.render('rooms/index', {rooms: rooms});
});

router.post('/', async function(req, res, next) {
  const room = new Room(req.body);
  await room.save()
  res
  .set('Content-Type', 'application/javascript')
  .render('js/redirect', {redirect: "/rooms"});
});

router.get('/:id', function(req, res, next) {
  Appointment.find({
    room: req.params.id
  },(err, appointments) => {
    res.render('rooms/detail', {
      title: 'Room',
      waitingList: WaitingListService.waitingList(req.params.id),
      planned: appointments,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    });
  })
});

router.get('/:id/fragments/waitingList', (req, res, next) => {
  res.render('rooms/fragments/waiting_list', {waitingList: WaitingListService.waitingList(req.params.id)});
})


/**
 * Test only
 */
router.get('/viewer', function(req, res, next) {
  res.render('rooms/viewer_test');
})


module.exports = router;
