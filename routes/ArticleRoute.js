var express = require('express');
var router = express.Router();
loggedin = false;
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");
var swig  = require("../application/models/SwigRenderer");

rdbHelper.connect();

/* GET article page. */
router.get('/show', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    //TODO
  }
  else {
    swig.Render(res, 'article', {
      title: 'Blog Sausage',
      isloggedin: false,
      method: 'show'
    });
  }
});

/* GET article page. */
router.get('/', function(req, res, next) {
  //TODO
});

module.exports = router;
