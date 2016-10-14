var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var rdbHelper = require('../DataBaseHelper');
var rdb = require("rethinkdb");



rdbHelper.connect();

const ERROR_USERNAME_NOT_FOUND = "Email not found!";
const ERROR_USERNAME_INVALID = "Email invalid!";
const ERROR_USERNAME_EMPTY = "Email cannot be empty!";
const ERROR_USERNAME_TOO_SHORT = "Email must have at least 3 characters!"


router.post('/', urlencodedParser, function (req,res,next) {
  if (!req.body) return res.sendStatus(400);
  login(req, res, req.body.username, req.body.password);

});

function login(req, res, email, password) {
  //check email
  rdb.table("users").filter(rdb.row("email").eq(email)).filter(rdb.row("password").eq(password)).run(connection, function(err, cursor) {
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
              res.cookie("userid", row.id, 1, { domain: ".localhost",maxAge: 3600});
              res.cookie("email", row.email, 1, { domain: ".localhost",maxAge: 3600});
              res.send("done");
            }
          }
          else {
             res.send("Email/Password combination doesn't exists!");
          }
        }
      });
    }
  });

  
}

function hash(string) {
  var crypto = require('crypto'),
      salt = crypto.randomBytes(128).toString('base64'), key;

  crypto.pbkdf2( string, salt, 10000, 512, function(err, dk) { key = dk; } );
  console.log(key);
}



module.exports = router;
