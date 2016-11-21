var express = require('express');
var router = express.Router();

var rdb = require("rethinkdb");
var Webuser  = require("../application/models/Webuser");
var Article  = require("../application/models/Article");
var articles;

var swig = require("../application/models/SwigRenderer");

/* GET home page. */
router.get('/', function(req, res, next) {
  getArticles();

  if(req.cookies.userid && req.cookies.email) {
    Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function(connection, user) {
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
  Article.getArticles(function (err, articles) {
    this.articles = articles;
  });
}


module.exports = router;
