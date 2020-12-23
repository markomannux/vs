require('dotenv').config();

var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var cookieParser    = require('cookie-parser');
var logger          = require('morgan');
var session         = require('express-session');
const MongoStore    = require('connect-mongo')(session);
var passport        = require('passport');
const mongoose      = require('mongoose')
const passportCognitoStrategy = require('./utils/passport-strategies/cognito')
const passportTestStrategy = require('./utils/passport-strategies/test')

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}
const User = require('./model/user')
const authUtils = require('./utils/auth-utils')
const dateUtils = require('./utils/date-utils')

const AUTH_URL = process.env.AUTH_URL; 
const TOKEN_URL = process.env.TOKEN_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

mongoose.connect(process.env.MONGO_URI, mongoOptions)

var app = express();

require('./data-init')

var adminRouter = require('./routes/admin/index');
var usersAdminRouter = require('./routes/admin/users');
var roomsAdminRouter = require('./routes/admin/rooms');

var indexRouter = require('./routes/index');
var contactsRouter = require('./routes/contacts');
var appointmentsRouter = require('./routes/appointment');
var calendarRouter = require('./routes/calendar');
var roomRouter = require('./routes/rooms');
var signerRouter = require('./routes/signer')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const sessionMiddleware = session({
    secret: process.env.COOKIE_KEY || "cookie_secret_123",
    resave: true,
    saveUninitialized: true,
    maxAge: 2592000000,
    cookie: {
        maxAge: 2592000000
    },
    store: new MongoStore({client: mongoose.connection.getClient()})
})

app.use(sessionMiddleware);
app.sessionMiddleware = sessionMiddleware // Storing a reference to session middleware for use in other modules

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session())

passport.serializeUser((user, done) => {
  return done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await User.findOne({username: username})
  return done(null, user);
});

app.use(express.static(path.join(__dirname, 'public')));

/*
 * Registering helper functions
 */
app.locals.helperFormatDate = dateUtils.formatDate
const pug = require('pug')
const includeFunc = (pathToPug, options = {}) => {
    return pug.renderFile(pathToPug, options); //render the pug file
}
app.locals.helperInclude = includeFunc
const env = (envName) => {
  return process.env[envName]
}
app.locals.env = env

app.locals.Room = require('./model/room')

// Passport strategy
passportCognitoStrategy(app, passport)
//passportTestStrategy(app, passport)


app.use('/admin', authUtils.hasRole('admin'), adminRouter);
app.use('/admin/users', authUtils.hasRole('admin'), usersAdminRouter);
app.use('/admin/rooms', authUtils.hasRole('admin'), roomsAdminRouter);
app.use('/', authUtils.isLoggedIn, authUtils.hasRole('user'), indexRouter);
app.use('/contacts', contactsRouter);
app.use('/appointments', authUtils.hasRole('user'), appointmentsRouter);
app.use('/calendar', authUtils.hasRole('user'), calendarRouter);
app.use('/rooms', authUtils.hasRole('user'), roomRouter);
app.use('/signer', signerRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
