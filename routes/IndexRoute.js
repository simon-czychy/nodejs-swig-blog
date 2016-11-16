var express = require('express');
var router = express.Router();
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");
var Webuser  = require("../application/models/Webuser");
var articles;
var swig = require("../application/models/SwigRenderer");

rdbHelper.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  getArticles();
  if(req.cookies.userid && req.cookies.email) {
    Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function(connection, user) {
      var loggedin = false;
      var isAdmin = false;
      if(!user || typeof user == "undefined") {
        swig.RenderIndex(res);
      }
      else {
        swig.RenderIndex(res, true, user.level === "admin");
      }
    });
  }
  else {
    swig.RenderIndex(res);
  }
});

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
