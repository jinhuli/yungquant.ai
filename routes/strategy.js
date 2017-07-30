var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.render('strategy');
});

router.get('/mac', function(req,res){
    res.render('mac');
});

router.get('/reversion', function(req,res){
    res.render('reversion');
});

router.get('/momentum', function(req,res){
    res.render('momentum');
});

router.get('/breakout', function(req,res){
    res.render('breakout');
});

router.get('/monte', function(req,res){
    res.render('monte');
});

module.exports = router;