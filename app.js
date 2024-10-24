var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var session = require('express-session');
var fileUpload = require('express-fileupload');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login');
var adminRouter = require('./routes/admin/novedades');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '12w45qe1qe4q1eq54eq5',
  resave: false,
  saveUninitialized: true
}));

async function secured(req, res, next) {
  try {
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.error('Error en secured middleware:', error);
    next(error);
  }
}

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/novedades', secured, adminRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
