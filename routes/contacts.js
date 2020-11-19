var express = require('express');
var router = express.Router();
const Contact = require('../model/contact');
const Appointment = require('../model/appointment')
const dateUtils = require('../utils/date-utils')

/* GET users listing. */
router.get('/', function(req, res, next) {
  Contact.find((err, contacts) => {
    res.render('contacts/index', {
      title: 'Contatti',
      contacts: contacts
    });
  });
});

router.post('/', function(req, res, next) {
  const contact = new Contact(req.body);
  contact.save()
  .then((err, data) => {
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: `/contacts/${contact._id}`});
  });
});

router.get('/:id', async (req, res, next) => {
  const contact = await Contact.findById(req.params.id)
  const today = dateUtils.convertToDateString(new Date())
  const appointments = await Appointment.find({contact: contact, start: {$gte: today}}).sort({start: 1})
  const pastAppointments = await Appointment.find({contact: contact, start: {$lt: today}}).sort({start: 1}).limit(10)
  res.render('contacts/detail', {
    title: contact.fullname,
    contact,
    appointments,
    pastAppointments
  });
})

router.delete('/:id', async (req, res, next) => {
  let contact = await Contact.findById(req.params.id)
  contact.remove((err, data) => {
      res
      .set('content-type', 'application/javascript')
      .render('js/redirect', {redirect: "/contacts"});
  })
})


module.exports = router;
