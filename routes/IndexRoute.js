var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.php', {
    get : 
    {
      title: 'Node With Express and Pug', 
      message: 'Welcome to Nodejs With Express and Pug' 
    }
  });
});

module.exports = router;
