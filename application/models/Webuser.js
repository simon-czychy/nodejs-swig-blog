var crypto = require('crypto'),
    config = require("../config/config").Config,
    DBConnection = require("../../DataBaseConnector");




exports.manualLogin = function(user, password, res, callback) {
  console.log("Login: %s", user);

  DBConnection.onConnection(function(err,connection) {
    if(err) {
      console.log("[ERROR][manualLogin]: %s:%s\n%s", err.name, err.msg, err.message);
      callback(null);
      return;
    }

    rdb.table("users").filter(rdb.row("email").eq(user)).limit(1).run(connection, function(err, cursor) {
      if(err) {
        console.log("[ERROR][manualLogin]: %s:%s\n%s", err.name, err.msg, err.message);
        callback(null);
      }
      else {
        var result = { status: "unkown-error", message: "Something went wrong. Please contact the Administrator." };
        cursor.next(function(err, row) {
          if(err) {
            console.log("[ERROR][manualLogin][CURSOR]: %s:%s\n%s", err.name, err.msg, err.message);
            DBConnection.release(connection);
            result = {status: "login-failed", message: "User or Password incorrect. Try again!" }
          }
          else {
              validatePassword(password, row.password, function(err, passCorrect) {
              if(passCorrect) {
                callback(null, row);
                result = {status: "login-successful", message: "Login sucessful. Welcome User!" }
              }
              else {
                callback('login-failed');
                result = {status: "login-failed", message: "User or Password incorrect. Try again!" }
              }
                DBConnection.release(connection);
            });
          }
          res.send(result);
        });
      }
    });
  });
}


exports.autoLogin = function(userid, email, res, callback) {
  console.log("AutoLogin: %s", email);

  DBConnection.onConnection(function(err,connection) {
    if(err) {
      console.log("[ERROR][autoLogin]: %s:%s\n%s", err.name, err.msg, err.message);
      callback(null);
      return;
    }

    rdb.table("users").filter(rdb.row("email").eq(email)).limit(1).run(connection, function(err, cursor) {
      if(err) {
        console.log("[ERROR][autoLogin]: %s:%s\n%s", err.name, err.msg, err.message);
        callback(null);
      }
      else {
        var statusMessage = undefined;
        cursor.next(function(err, row) {
          if(err) {
            console.log("[ERROR][autoLogin][CURSOR]: %s:%s\n%s", err.name, err.msg, err.message);
            DBConnection.release(connection);
            statusMessage = "invalid-session";
          }
          else {
              validateCookie(userid, row.id, function(err, isCookieValid) {
              if(isCookieValid) {
                callback(null, row);
                statusMessage = "auto-login-successful";
              }
              else {
                callback(null);
                statusMessage = "auto-login-failed";
              }
                DBConnection.release(connection);
            });
          }
        });
      }
    });
  });
}

exports.getUserByID = function (id, callback) {
  console.log("GetUserByID: %s", id);

  DBConnection.onConnection(function(err,connection) {
    if(err) {
      console.log("[ERROR][GETUSERBYID]: %s:%s\n%s", err.name, err.msg, err.message);
      callback(null);
      return;
    }

    rdb.table("users").filter(rdb.row("id").eq(id)).limit(1).pluck("name", "desc", "avatar").run(connection, function(err, cursor) {
      if(err) {
        console.log("[ERROR][GETUSERBYID]: %s:%s\n%s", err.name, err.msg, err.message);
        callback(null);
      }
      else {
        cursor.next(function(err, user) {
          if(err) {
            console.log("[ERROR][GETUSERBYID][CURSOR]: %s:%s\n%s", err.name, err.msg, err.message);
            callback(null);
            DBConnection.release(connection);
          }
          else {
            callback(null, user)
          }
        });
      }
    });
  });
}



//==================================== PRIVATE METHODS ===================================//

var generateSalt = function()
{
     var salt = crypto.randomBytes(128).toString('hex');
     return salt;
}

var md5 = function(str)
{
   return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
  var salt = generateSalt();
  callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
  var salt = hashedPass.substr(0, 10);
  var validHash = salt + md5(plainPass + salt);
  callback(null, hashedPass === validHash);
}

var validateCookie = function(userid, rowuserid, callback)
{
  callback(null, userid === rowuserid)
}

/*
var createHashPassword = function(plainPass) {
    var salt = generateSalt().substr(0,10);
    var validHash = salt + md5(plainPass + salt);
    return validHash;
}*/
