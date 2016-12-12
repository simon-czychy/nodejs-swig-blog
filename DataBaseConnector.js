var dbConfig = require('./application/config/config').dbConfig,
    rdb = require('rethinkdb'),
    connectionPooling = false,
    connectionPool = null,
    config = require("./application/config/config").Config;


//if pool connection is configured, use it
if (typeof dbConfig.pool === 'object') {
    var pool = require('generic-pool');
    connectionPooling = true;

    connectionPool = pool.Pool({
        name: 'rethinkdb',
        max : dbConfig.pool.max || 1000,
        min : dbConfig.pool.min || 2,
        log : dbConfig.pool.log || true,
        idleTimeoutMillis : dbConfig.pool.idleTimeoutMillis || 60 * 1000,
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

module.exports = {
    connect: function() {
        rdb.connect({host: 'localhost', port: 28015, db: "blog"}, function(err, conn){
            if (err) throw err;
            connection = conn;
        });
    },
    release: function (connection) {
        console.log("[DEBUG]: Disconnecting connection: %s", connection._id);
        if(connectionPooling) {
            connectionPool.release(connection);
        }
        else {
            connection.close();
        }
    },
    onConnection: function (callback) {
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
};
