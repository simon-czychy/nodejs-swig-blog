var express = require('express');
var router = express.Router();
loggedin = false;
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");

rdbHelper.connect();

/* GET article page. */
router.get('/show', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    isCookieValid(res, req.cookies.userid, req.cookies.email);
  }
  else {
    loggedin = false;
    res.render('article',  {
      title: 'Blog Sausage',
      isloggedin: loggedin,
      method: 'show'
    });
  }
});

/* GET article page. */
router.get('/', function(req, res, next) {

  res.redirect("/show");
});

module.exports = router;
