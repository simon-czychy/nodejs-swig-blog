var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var rdb = require("rethinkdb");
var Webuser  = require("../application/models/Webuser");
var config = require("../application/modules/config").Config;

const ERROR_USERNAME_NOT_FOUND = "Email not found!";
const ERROR_USERNAME_INVALID = "Email invalid!";
const ERROR_USERNAME_EMPTY = "Email cannot be empty!";
const ERROR_USERNAME_TOO_SHORT = "Email must have at least 3 characters!"


router.post('/', urlencodedParser, function (req,res,next) {
  if (!req.body) {
    return res.status(400).send().end();
  }
  Webuser.Login(req.body.username, req.body.password, function(connection, user) {
    if(!user || typeof user == "undefined") {
      //res.send("Something wrent wrong!");
    }
    else {
        res.cookie("userid", user.id, 1, { domain: config.host, maxAge: 3600});
        res.cookie("email", user.email, 1, { domain: config.host, maxAge: 3600});
    }
  }, res );
});

module.exports = router;
