var express = require('express');
var router = express.Router();
const Room = require('../../model/room');
const redirect = require('../../utils/redirect')
const bindAndValidate = require('../../utils/bind-and-validate')

router.get('/', async function(req, res, next) {
  const rooms = await Room.find();
  res.render('admin/rooms/index', {
    model: {
      rooms
    }
  });
});

router.post('/', bindAndValidate(Room, 'create', 'admin/rooms'), async function(req, res, next) {
  const room = new Room(req.body);
  await room.save()
  redirect(res, "/admin/rooms")
});

router.delete('/:id', async function(req, res, next) {
  const room = await Room.findById(req.params.id)
  room.remove((err, data) => {
    redirect(res, "/admin/rooms")
  })
});

module.exports = router