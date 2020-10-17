var express = require('express');
var router = express.Router();
const Contact = require('../model/contact');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Contact.find((err, contacts) => {
    res.render('contacts', {contacts: contacts});
  });
});

router.get('/:id', (req, res, next) => {
  Contact.findById(req.params.id, (err, contact) => {
    res.render('contact', {contact: contact});
  })
})

router.post('/', function(req, res, next) {
  const contact = new Contact(req.body);
  contact.save()
  .then((err, data) => {
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: "/contacts"});
  });
});

module.exports = router;
