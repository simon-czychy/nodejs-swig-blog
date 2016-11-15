var express = require('express');
var router = express.Router();
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");
var articles;

rdbHelper.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  getArticles();
  if(req.cookies.userid && req.cookies.email) {
    checkCookie(res, req.cookies.userid, req.cookies.email);
  }
  else {
    loggedin = false;
    return res.render('index',  {
      title: 'Blog Sausage',
      isloggedin: false,
      showLoginButton: true,
      isAdmin: false,
      articles: this.articles
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

function getArticles() {
  rdb.table("article").run(connection, function(err, cursor) {
    if(err) {
      throw err;
    }
    else {
      cursor.toArray(function(err, result) {
        if(err) {
          throw err;
        }
        else {
          this.articles = result;
        }
      });
    }
  });
}


module.exports = router;
