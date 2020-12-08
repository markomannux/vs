const LocalStrategy = require('passport-local')

function init(app, passport) {
  console.log('Local passport strategy initialization')
  passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: 'admin' }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        //if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
        });
    }
  ));

  app.get('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/'
    }))
}

module.exports = init