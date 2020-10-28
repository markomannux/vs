require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true 
}
mongoose.connect(process.env.MONGO_URI, mongoOptions);

var adminRouter = require('./routes/admin/index');
var usersAdminRouter = require('./routes/admin/users');
var roomsAdminRouter = require('./routes/admin/rooms');

var indexRouter = require('./routes/index');
var contactsRouter = require('./routes/contacts');
var appointmentsRouter = require('./routes/appointment');
var calendarRouter = require('./routes/calendar');
var roomRouter = require('./routes/rooms');

require('./data-init')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/admin/users', usersAdminRouter);
app.use('/admin/rooms', roomsAdminRouter);
app.use('/', indexRouter);
app.use('/contacts', contactsRouter);
app.use('/appointments', appointmentsRouter);
app.use('/calendar', calendarRouter);
app.use('/rooms', roomRouter);

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
