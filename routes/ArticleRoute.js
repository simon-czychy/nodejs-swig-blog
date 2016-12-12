var express = require('express');
var router = express.Router();
var rdb = require("rethinkdb");
var DBConnection = require("../DataBaseConnector");
var swig  = require("../application/models/SwigRenderer");
var Webuser  = require("../application/models/Webuser");
var Article = require("../application/models/Article");
var moment = require("moment")


/* GET article page. */
router.get('/show', function(req, res) {

  if(req.cookies.userid && req.cookies.email) {
    //TODO
  }
  else {
    swig.Render(res, 'article', {
      isloggedin: false,
      method: 'show'
    });
  }
});

router.post('/add', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {

      Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
        if (!user || typeof user == "undefined") {
          res.send("not-loggedin");
        }
        else {
          var tags = req.body.tags;
          req.body.tags = tags.split(" ");
          req.body.author = req.cookies.userid;
          req.body.releaseDate = moment().format("DD.MM.YYYY hh:mm:ss");
          req.body.uniqueArticleID = req.body.title.replace(/\s+/g, '-').toLowerCase();

          Article.addArticle(res, req.body, function(connection, info) {
            if(!info || typeof info == "undefined") {
              res.send("error");
            }
            else {
              res.send("article-added");
            }
          });
        }
      });
  }
  else {
    swig.RenderIndex(res);
  }
});

router.post('/delete', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {

      Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
        if (!user || typeof user == "undefined") {
          res.send("not-loggedin");
        }
        else {
          Article.deleteArticle(req.body.id, function(connection, info) {
            if(!info || typeof info == "undefined") {
              res.send("error");
            }
            else {
              res.send("article-deleted");
            }
          });
        }
      });
  }
  else {
    swig.RenderIndex(res);
  }
});


/* GET article page. */
router.get('/', function(req, res, next) {
  //TODO
});

module.exports = router;
