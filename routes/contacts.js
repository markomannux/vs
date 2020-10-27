var express = require('express');
var router = express.Router();
const Contact = require('../model/contact');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Contact.find((err, contacts) => {
    res.render('contacts/index', {contacts: contacts});
  });
});

router.post('/', function(req, res, next) {
  const contact = new Contact(req.body);
  contact.save()
  .then((err, data) => {
    res
    .set('Content-Type', 'application/javascript')
    .render('js/redirect', {redirect: "/contacts"});
  });
});

router.get('/:id', (req, res, next) => {
  Contact.findById(req.params.id, (err, contact) => {
    res.render('contacts/detail', {contact: contact});
  })
})

router.delete('/:id', async (req, res, next) => {
  let contact = await Contact.findById(req.params.id)
  contact.remove((err, data) => {
      res
      .set('Content-Type', 'application/javascript')
      .render('js/redirect', {redirect: "/contacts"});
  })
})


module.exports = router;
