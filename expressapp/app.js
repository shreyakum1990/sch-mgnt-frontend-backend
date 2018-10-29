var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors'); //here define cors
var app = express();

//here we use cors
//here we pass to options first id origin: it is domain want to allowed and second is credentials to check the cookies
app.use(cors({
 origin:['http:localhost:4200','http://127.0.0.1:4200'],
 credentials:true
                       
}));
//we need mongoose to connect the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/schooldb');

//passport
var passport = require('passport');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//this session provide lot of functionality to us but we used few of them right over here
app.use(session({
  name:'myname.shreya',
  resave:false, //because we dont want to save the object for every request untill unless it is changed
  saveUninitialized:false, //here we dont want to save the request untill it will successfully login and it is with the help of passportjs
  secret:'secret',
  cookie:{
    maxAge:36000000,
    httpOnly:false,
    secure:false
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
require('./passport-config'); //it will bring the complete code in app.js and then it will initialize the passport
app.use(passport.initialize()); //by mistake here creating a passport session before initialize. Which will fix later in video.
app.use(passport.session());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
