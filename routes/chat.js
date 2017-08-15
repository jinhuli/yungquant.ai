var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(req.device.type == 'phone'){
    res.render('mobilechat');
  }
  else{
    res.render('chat');
  }
});

module.exports = router;
