var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBSession = require('connect-mongodb-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var evaluationRouter = require('./routes/evaluation');
var introductionRouter = require('./routes/introduction');
var selectionRouter = require('./routes/selection');
var dashboardRouter = require('./routes/evaluationdashboard');
var adminRouter = require('./routes/admin');
var employeeRouter = require('./routes/employees');
var criteriaRouter = require('./routes/criteria');
var questionRouter = require('./routes/questions');
var supervisorRouter = require('./routes/supervisor');
var resultsRouter = require('./routes/results');


var app = express();

//mongodb
mongoose.connect('mongodb://localhost:27017/OES')
  .then((res) => {
    console.log("MongoDB Connected!");
  });

const store = new MongoDBSession({
  uri: 'mongodb://localhost:27017/OES',
  collection: 'OESSessions',
});

mongoose.set('strictQuery', false);

//Session
app.use(
  session({
    secret: "5L Secret Key",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit: 100000000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/evaluation', evaluationRouter);
app.use('/introduction', introductionRouter);
app.use('/selection', selectionRouter);
app.use('/evaluationdashboard', dashboardRouter);
app.use('/admin', adminRouter);
app.use('/employees', employeeRouter);
app.use('/criteria', criteriaRouter);
app.use('/questions', questionRouter);
app.use('/supervisor', supervisorRouter);
app.use('/results', resultsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
