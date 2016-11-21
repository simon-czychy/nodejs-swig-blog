var rdb = require('rethinkdb'),
    config = require("../modules/config").Config,
    DBConnection = require("../../DataBaseConnector");



exports.addArticle = function(res, article, callback) {
    console.log("AddArticle: %s", article.title);

    DBConnection.onConnection(function(err,connection) {
        if(err) {
            console.log("[ERROR][AddArticle]: %s:%s\n%s", err.name, err.msg, err.message);
            callback(null);
            return;
        }

        rdb.table("article").insert(article).run(connection, function(err, info) {
            if(err) {
                console.log("[ERROR][AddArticle]: %s:%s\n%s", err.name, err.msg, err.message);
                callback(null);
            }
            else {
                callback(null, info);
            }
        });
    });
}

exports.getArticles = function (callback) {
    console.log("GetArticles");

    DBConnection.onConnection(function(err,connection) {
        if(err) {
            console.log("[ERROR][AddArticle]: %s:%s\n%s", err.name, err.msg, err.message);
            callback(null);
            return;
        }
        rdb.table('article').merge(function (article) {
            return {
                author: rdb.table('users').getAll(article('author'), {index: 'id'}).pluck("name", "avatar","desc").coerceTo('ARRAY')
            }
        }).run(connection, function(err, cursor) {
            if(err) {
                console.log("[ERROR][AddArticle]: %s:%s\n%s", err.name, err.msg, err.message);
                callback(null);
            }
            else {
                cursor.toArray(function(err, articles) {
                    if(err) {
                        console.log("[ERROR][AddArticle]: %s:%s\n%s", err.name, err.msg, err.message);
                        callback(null);
                    }
                    else {
                        callback(null, articles);
                    }
                });
            }
        });
    });
}

