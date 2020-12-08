const express = require('express');
const User = require('../../model/user');
const Room = require('../../model/room');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find((err, users) => {
    res.render('admin/users/index', {users});
  });
});

router.get('/:id', async function(req, res, next) {
  const user = await User.findById(req.params.id).populate('rooms')
  res.render('admin/users/detail', {user});
});

router.put('/:id', function(req, res, next) {
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: `/admin/users/${req.params.id}`});
});

router.post('/:id/room', async function(req, res, next) {
  const user = await User.findById(req.params.id)
  const room = await Room.findById(req.body.room)
  user.rooms.push(room)
  user.save((err, data) => {
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: `/admin/users/${req.params.id}`});
  })
});

module.exports = router;
