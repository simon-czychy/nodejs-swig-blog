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
      isloggedin: loggedin
    });
  }
});


router.post('/addarticle', function(req, res, next) {
  if(loggedin) {
    console.log(req.body);
    var tags = req.body.tags;
    req.body.tags = tags.split(" ");
    rdb.table("article").insert(req.body).run(connection);
    res.send("added-article");
  }
  else {
    res.send("not-loggedin");
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
            if(row["level"] != "admin"){
                return res.redirect("/login");
            }
            if(row !== "" && row !== null && row !== "undefined") {
              loggedin = true;
              return res.render(view, options);
            }
          }
        }
      });
    }
  });
}

module.exports = router;
