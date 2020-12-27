var express = require('express');
var router = express.Router();
const Contact = require('../model/contact');
const Appointment = require('../model/appointment')
const Room = require('../model/room')
const dateUtils = require('../utils/date-utils')
const bindAndValidate = require('../utils/bind-and-validate')
const redirect = require('../utils/redirect')

/* GET users listing. */
router.get('/', async (req, res, next) => {
  Contact.find((err, contacts) => {
    res.render('contacts/index', {
      title: 'Contatti',
      contacts: contacts
    });
  });
});

formDataPreload = async () => {
    return {rooms: await Room.find({})}
}

router.get('/:id', async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
  const today = dateUtils.convertToDateString(new Date())
  const appointments = await Appointment.find({contact: contact, start: {$gte: today}}).sort({start: 1})
  const pastAppointments = await Appointment.find({contact: contact, start: {$lt: today}}).sort({start: 1}).limit(10)
  const formPreload = await formDataPreload()
  res.render('contacts/detail', {
    title: contact.fullname,
    model: {
      ...formPreload,
      contact,
      appointments,
      pastAppointments
    }
  });
})

router.post('/', bindAndValidate(Contact, 'create', 'contacts'), async (req, res, next) => {
  const contact = req.boundModel
  await contact.save()
  redirect(res, `/contacts/${contact._id}`)
});

router.post('/edit', bindAndValidate(Contact, 'create', 'contacts'), async (req, res, next) => {
  let contact = await Contact.findById(req.boundModel._id)
  await contact.update(req.boundModel)
  redirect(res, `/contacts/${contact._id}`)
});

router.delete('/:id', async (req, res, next) => {
  let contact = await Contact.findById(req.params.id)
  contact.remove((err, data) => {
    redirect(res, '/contacts')
  })
})

module.exports = router;
