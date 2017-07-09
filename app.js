var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mongoose = require('mongoose');
//var GoogleStrategy = require('passport-google-oauth20').Strategy;
//var passport = require('passport');
//var User = require('./models/users');

//mongoose.connect('localhost:27017/yq');

var index = require('./routes/index');
var chat = require('./routes/chat');
//var login = require('./routes/login');
var strategy = require('./routes/strategy');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('express-ejs-extend')); 


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
//app.use(passport.initialize());
//app.use(passport.session());

/*
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: '621638870105-prp4sr1dv68mjvb9vggch9pk44ilooar.apps.googleusercontent.com',
    clientSecret: '1eFdgGg6atA7Dpnm-41ddetD',
    callbackURL: 'http://localhost:3000/login/google/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({googleId: profile.id}, function(err, user){
      if(err) throw err;
      if(user == null){
        var newUser = new User({googleId: profile.id, username: profile.displayName});
        newUser.save();
      }
        return cb(null, profile);
    });
  }
));

*/
app.use('/', index);
app.use('/chat', chat);
//app.use('/login', login);
app.use('/strategy', strategy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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