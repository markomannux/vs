var express = require('express');
var router = express.Router();
const Room = require('../../model/room');

router.get('/', async function(req, res, next) {
  const rooms = await Room.find();
  res.render('admin/rooms/index', {rooms: rooms});
});

router.post('/', async function(req, res, next) {
  const room = new Room(req.body);
  await room.save()
  res
  .set('Content-Type', 'application/javascript')
  .render('js/redirect', {redirect: "/admin/rooms"});
});

router.delete('/:id', async function(req, res, next) {
  const room = await Room.findById(req.params.id)
  room.remove((err, data) => {
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: "/admin/rooms"});
  })
});

module.exports = router