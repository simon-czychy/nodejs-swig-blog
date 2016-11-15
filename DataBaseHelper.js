var rdb = require("rethinkdb");

module.exports = {
    connect: function() {
        rdb.connect({host: 'localhost', port: 28015, db: "blog"}, function(err, conn){
            if (err) throw err;
            connection = conn;
        });
    },
    rdb: rdb
};
