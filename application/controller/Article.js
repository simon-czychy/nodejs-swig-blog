"use strict";
var rdb = require('rethinkdb'),
    config = require("../config/config").Config,
    DBConnection = require("../../DataBaseConnector");

module.exports = class Article extends ArticleModel {

  constructor(title, subtitle, content, tags, authorId){
      super(title || "title", subtitle || "subtitle", content || "content", tags || "tags", authorId || "authorId");
  }

  add(article, callback) {
    console.log("AddArticle: %s", article.title);
    DBConnection.onConnection(function(err,connection) {
        if(err || !article) {
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

  getAll(callback) {
    console.log("GetArticles");

    DBConnection.onConnection(function(err,connection) {
        if(err) {
            console.log("[ERROR][AddArticle]: %s:%s\n%s", err.name, err.msg, err.message);
            callback(null);
            return;
        }
        rdb.table('article').merge(function (article) {
            return {
                authorId: rdb.table('users').getAll(article('authorId'), {index: 'id'}).pluck("name", "avatar","desc").coerceTo('ARRAY')
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

  delete(id, callback) {
    console.log("DeleteArticle: %s", id);

    DBConnection.onConnection(function(err,connection) {
        if(err) {
            console.log("[ERROR][DeleteArticle]: %s:%s\n%s", err.name, err.msg, err.message);
            callback(null);
            return;
        }

        rdb.table("article").filter({"id": id}).delete().run(connection, function(err, info) {
            if(err) {
                console.log("[ERROR][DeleteArticle]: %s:%s\n%s", err.name, err.msg, err.message);
                callback(null);
            }
            else {
                callback(null, info);
            }
        });
    });
  }

  validate(article, callback) {
    if(article.title.length >= 5 && article.subtitle.length >= 5 && article.content.length >= 5){
      callback(null, article);
      return;
    }
    callback(null, false);
    return;
  }
}
