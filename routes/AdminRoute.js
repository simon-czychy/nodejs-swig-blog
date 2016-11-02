var express = require('express');
var router = express.Router();
loggedin = false;
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");

rdbHelper.connect();

/* GET admin page. */
router.get('/', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    isCookieValid(res, req.cookies.userid, req.cookies.email, 'admin/admin',  {
      title: 'Blog Sausage',
      isloggedin: loggedin
    });
  }
  else {
    loggedin = false;
    res.render('index',  {
      title: 'Blog Sausage',
      message: 'Here you can find some awesome Blog posts!',
      isloggedin: loggedin
    });
  }
});

/* GET admin page. */
router.get('/article/add', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    isCookieValid(res, req.cookies.userid, req.cookies.email, 'admin/article/add',  {
      title: 'Blog Sausage',
      isloggedin: loggedin,
      host: req.headers.host
    });
  }
  else {
    loggedin = false;
    res.render('index',  {
      title: 'Blog Sausage',
      message: 'Here you can find some awesome Blog posts!',
      isloggedin: loggedin
    });
  }
});

function isCookieValid(res, userid, email, view, options) {
  rdb.table("users").filter(rdb.row("id").eq(userid)).filter(rdb.row("email").eq(email)).run(connection, function(err, cursor) {
    if(err) {
      throw err;
    }
    else {
      cursor.toArray(function(err, result) {
        if(err) {
          throw err;
        }
        else {
          var row = result[0];
          if(result.length == 1) {
            if(row !== "" && row !== null && row !== "undefined") {
              loggedin = true;
              res.render(view, options);
            }
          }
        }
      });
    }
  });
}

module.exports = router;
