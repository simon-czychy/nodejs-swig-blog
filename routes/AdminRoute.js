var express = require('express');
var router = express.Router();
loggedin = false;
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");

rdbHelper.connect();

/* GET admin page. */
router.get('/', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    checkCookie(res, req.cookies.userid, req.cookies.email);
  }
  else {
    loggedin = false;
  }

  res.render('index',  {
    title: 'Blog Sausage',
    message: 'Here you can find some awesome Blog posts!',
    isloggedin: loggedin
  });

});

function checkCookie(res, userid, email) {
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
              res.render('admin',  {
                title: 'Blog Sausage',
                isloggedin: loggedin
              });
            }
          }
        }
      });
    }
  });
}

module.exports = router;
