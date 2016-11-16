var express = require('express');
var router = express.Router();
var rdbHelper = require('../DataBaseConnector');
var Webuser  = require("../application/models/Webuser");
var rdb = require("rethinkdb");
var swig  = require("../application/models/SwigRenderer");

rdbHelper.connect();

/* GET admin page. */
router.get('/', function(req, res, next) {

  if(req.cookies.userid && req.cookies.email) {
    Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function(connection, user) {
      if(!user || typeof user == "undefined") {
        swig.RenderIndex(res);
      }
      else {
        swig.Render(res, "admin", {
          "isloggedin": true,
          "isAdmin": user.level === "admin"
        });
      }
    });
  }
  else {
    swig.RenderIndex(res);
  }
  
  
  
  
});

module.exports = router;
