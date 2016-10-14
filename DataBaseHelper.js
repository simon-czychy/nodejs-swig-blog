var r = require("rethinkdb");

module.exports = function getUserLogin(email, password) {
    r.table("users").filter(r.row("email").eq(email)).filter(r.row("password").eq(password)).
    run(connection, function(err, cursor){
        if(err) throw err;
        cursor.toArray(function (err, result) {
            if(err) throw err;
            console.log(JSON.stringify(result[0],null,2));
        });
    });
}

module.exports = function connect() {
    r.connect({host: 'localhost', port: 28015, db: "blog"}, function(err, conn){
        if (err) throw err;
        connection = conn;
    });
}