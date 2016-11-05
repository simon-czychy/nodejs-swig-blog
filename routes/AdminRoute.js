var express = require('express');
var router = express.Router();
loggedin = false;
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");

rdbHelper.connect();

/* GET admin page. */
router.get('/', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    isCookieValid(res, req.cookies.userid, req.cookies.email);
  }
  else {
    loggedin = false;
    return res.render('admin',  {
      title: 'Blog Sausage',
      message: 'Here you can find some awesome Blog posts!',
      isloggedin: loggedin,
      isAdmin: isAdmin
    });
  }
});

function isCookieValid(res, userid, email) {
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
            if(row["level"] != "admin"){
                return res.redirect("/login");
            }
            if(row !== "" && row !== null && row !== "undefined") {
              loggedin = true;
              return res.render('admin',  {
                title: 'Blog Sausage',
                isloggedin: loggedin,
                isAdmin: isAdmin
              });
            }
          }
        }
      });
    }
  });
}

module.exports = router;
