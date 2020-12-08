var express = require('express');
var router = express.Router();
const Appointment = require('../model/appointment');
const Room = require('../model/room');
const WaitingListService = require('../services/waiting-list');
const dateUtils = require('../utils/date-utils')

router.get('/', async function(req, res, next) {
  const rooms = await Room.find();
  switch (req.accepts(['json', 'html'])) {
    case 'html':
      res.render('rooms/index', {
        title: 'Stanze',
        rooms: rooms
      });
      break
    case 'json':
      res.json(rooms);
      break
  }
});

router.get('/:id', async function(req, res, next) {
  const room = await Room.findById(req.params.id)
  const today = dateUtils.convertToDateString(new Date())
  const tomorrow = dateUtils.convertToDateString(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
  const appointments = await Appointment.find({
    room: req.params.id,
    start: {$gte: today, $lt: tomorrow}
  })
  .sort({date: 1})
  .populate('contact')

  res.render('rooms/detail', {
    title: room.name,
    room,
    waitingList: WaitingListService.waitingList(req.params.id),
    planned: appointments
  });
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
