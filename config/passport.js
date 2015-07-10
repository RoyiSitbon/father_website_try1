var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../api/users/users.model');

// Configuring Passport

//using our own fields and not default username,password fields
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    User.findOne({email:email}).exec(function(err,user) {
      console.log("user",user);
      console.log("password",password);
      if(user && user.authenticate(password)) {
        return done(null, user);
      } else {
        return done(null,false);
      }
    });
  }
));

passport.serializeUser(function(user,done) {
  if(user) {
    done(null,user._id);
  }
});

passport.deserializeUser(function(id,done) {
  User.findOne({_id:id}).exec(function(err,user) {
    if(user) {
      return done(null,user);
    } else {
      return done(null,false);
    }
  });
});