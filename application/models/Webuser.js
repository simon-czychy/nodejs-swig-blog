var crypto = require('crypto'),
    dbConfig = require('../modules/config').dbConfig,
    rdb = require('rethinkdb'),
    connectionPooling = false,
    connectionPool = null,
    config = require("../modules/config").Config;


//if pool connection is configured, use it
if (typeof dbConfig.pool === 'object') {
  var pool = require('generic-pool');
  connectionPooling = true;

  connectionPool = pool.Pool({
    name: 'rethinkdb',
    max : dbConfig.pool.max || 1000,
    min : dbConfig.pool.min || 2,
    log : dbConfig.pool.log || true,
    idleTimeoutMillis : dbConfig.pool.idleTimeoutMillis || 1 * 60 * 1000,
    reapIntervalMillis: dbConfig.pool.reapIntervalMillis || 30 * 1000,

    create: function(callback) {
      rdb.connect({host: dbConfig.host, port: dbConfig.port}, function(err, connection) {
          if(err) {
            var errMsg = util.format("Failed connecting to RethinkDB instance on {host: %s, port: %s}", dbConfig.host, dbConfig.port);
            console.log("[ERROR]: " + errMsg);
            return callback(new Error(errMsg));
          }
          connection._id = Math.floor(Math.random()*10001);
          connection.use(dbConfig.db);
          console.log("[DEBUG]: Connection created: %s", connection._id);
          callback(null, connection);
      });
    },

    destroy: function(connection) {
      console.log("[DEBUG]: Connection closed: %s", connection._id);
      connection.close();
    }
  });

}


function onConnection(callback) {
  if(connectionPooling) {
    connectionPool.acquire(function(err, connection) {
      if(err) {
        callback(err);
      }
      else {
        console.log("[INFO]: Pooled connection: %s", connection._id);
        callback(null, connection);
      }
    });
  }
  else {
    rdb.connect({host: dbConfig.host, port: dbConfig.port}, function(err, connection) {
      if(err) {
        console.log("[ERROR]: Cannot connect to RethinkDB database: %s on port %s", dbConfig['host'], dbConfig['port']);
        callback(err);
      }
      else {
        connection._id = Math.floor(Math.random()*10001);
        connection.use(dbConfig.db);
        console.log("[DEBUG]: Connection established. ID: %s", connection._id);
        callback(null, connection);
      }
    });
  }
}

function release(connection) {
  console.log("[DEBUG]: Disconnecting connection: %s", connection._id);
  if(connectionPooling) {
    connectionPool.release(connection);
  }
  else {
    connection.close();
  }
}



exports.Login = function(user, password, callback, res) {
  console.log("Login: %s", user);

  onConnection(function(err,connection) {
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
        var statusMessage = "unkown-error";
        cursor.next(function(err, row) {
          if(err) {
            console.log("[ERROR][manualLogin][CURSOR]: %s:%s\n%s", err.name, err.msg, err.message);
            release(connection);
            statusMessage = "user-not-found";
          }
          else {
              validatePassword(password, row.password, function(err, passCorrect) {
              if(passCorrect) {
                callback(null, row);
                statusMessage = "login-successful";
              }
              else {

                callback('login-failed');
                statusMessage = "bad-pass";
              }
              release(connection);
            });
          }
          res.send(statusMessage);
        });
      }
    });
  });
}


/*
exports.getUserLevel = function(user, callback, res) {

  onConnection(function(err,connection) {
    if(err) {
      console.log("[ERROR][USERLEVEL]: %s:%s\n%s", err.name, err.msg, err.message);
      callback(null);
      return;
    }

    rdb.table("users").filter(rdb.row("level")).run(connection, function(err, cursor) {
      if(err) {
        console.log("[ERROR][USERLEVEL]: %s:%s\n%s", err.name, err.msg, err.message);
        callback(null);
      }
      else {
        var statusMessage = "unkown-error";
        cursor.next(function(err, row) {
          if(err) {
            console.log("[ERROR][USERLEVEL][CURSOR]: %s:%s\n%s", err.name, err.msg, err.message);
            release(connection);
          }
          else {
              validatePassword(password, row.password, function(err, passCorrect) {
              if(passCorrect) {
                callback(null, row);
                statusMessage = "login-successful";
              }
              else {

                callback('login-failed');
                statusMessage = "bad-pass";
              }
              release(connection);
            });
          }
          res.send(statusMessage);
        });
      }
    });
  });
}*/

//==================================== PRIVATE METHODS ===================================//

 var generateSalt = function() {
     var salt = crypto.randomBytes(128).toString('hex');
     return salt;
 }

 var md5 = function(str) {
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
  console.log("Salt:" + salt);
  var validHash = salt + md5(plainPass + salt);
  console.log("validHash:" + validHash);
  callback(null, hashedPass === validHash);
}
/*
var createHashPassword = function(plainPass) {
    var salt = generateSalt().substr(0,10);
    var validHash = salt + md5(plainPass + salt);
    return validHash;
}*/
