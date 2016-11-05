var rdb = require("rethinkdb");

module.exports = {
    connect: function() {
        rdb.connect({host: 'localhost', port: 28015, db: "blog"}, function(err, conn){
            if (err) throw err;
            connection = conn;
        });
    },
    
    insert: function(table, data) {
        rdb.table(table).insert(data).run(connection, function(err, result) {
            if(err) throw err;
        })
    },

    deleteAll: function(table) {
        rdb.table(table).delete().run(connection);
    },
    rdb: rdb
};


