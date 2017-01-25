exports.RethinkDB = function(){
  var rdb = require("rethinkdb");
  return rdb;
}

exports.Webuser = function(){
  var rdb = require(global.__base + "./application/models/Webuser");
  return rdb;
}

exports.Article = function(){
  var rdb = require(global.__base + "./application/controller/Article");
  return rdb;
}

exports.ArticleModel = function(){
  var rdb = require(global.__base + "./application/models/ArticleModel");
  return rdb;
}

exports.Express = function(){
  var rdb = require("express");
  return rdb;
}
