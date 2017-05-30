var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/users');



router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));


router.get('/google/return',
	passport.authenticate('google', { failureRedirect: '/login' }),
	function(req, res) {
    res.redirect('/chat');
});

module.exports = router;