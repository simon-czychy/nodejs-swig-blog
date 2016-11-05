var express = require('express');
var router = express.Router();
isloggedin = false;
isAdmin = false;
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");





rdbHelper.connect();

/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    checkCookie(res, req.cookies.userid, req.cookies.email);
  }
  else {
    loggedin = false;
    return res.render('index',  {
      title: 'Blog Sausage',
      isloggedin: isloggedin,
      showLoginButton: true
    });
  }


});

function checkCookie(res, userid, email) {
  rdb.table("users").filter(rdb.row("id").eq(userid)).filter(rdb.row("email").eq(email)).pluck('email', 'level').run(connection, function(err, cursor) {
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
              isAdmin = false;
              if(row["level"] == "admin") {
                  isAdmin = true;
              }
              return res.render('index',  {
                title: 'Blog Sausage',
                message: 'Here you can find some awesome Blog posts!',
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
