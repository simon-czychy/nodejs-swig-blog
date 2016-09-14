var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.php', {
    get : 
    {
      title: 'Blog Sausage',
      message: 'Here you can find some awesome Blog posts!'
    }
  });
});

module.exports = router;
