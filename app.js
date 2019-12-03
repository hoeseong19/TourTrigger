var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var toursRouter = require('./routes/tours');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.moment = require('moment');
app.locals.querystring = require('querystring');

mongoose.Promise = global.Promise;
const connStr = 'mongodb://hoeseong:mongo7850@cluster0-shard-00-00-7rcul.mongodb.net:27017,cluster0-shard-00-01-7rcul.mongodb.net:27017,cluster0-shard-00-02-7rcul.mongodb.net:27017/project?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(connStr, {useNewUrlParser: true});
mongoose.connection.on('error', console.error);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));

app.use(flash());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.currentUser = req.session.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tours', toursRouter);

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
