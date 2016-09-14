var express = require('express');
var phpExpress = require('php-express')({
  binPath: 'php'
});
// Default Route for Index
var IndexRoute = require('./routes/IndexRoute');

//create express instance
var app = express();

//set port
app.set('port', 80);


// set view engine to php-express
app.set('views', './application');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
//route all php files to the router
app.all(/.+\.php$/, phpExpress.router);

//set folder for static files like css, js, etc. to be served
app.use('/static', express.static(__dirname + '/static'));

//Route to Index
app.use('/', IndexRoute);

// catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Display errors from pug etc.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    get: {
      message: err.message,
      error: err
    }
  });
});

//Database

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});



//export
module.exports = app;

//listen on given port
app.listen(app.get('port'), function() {
  console.log("PHPExpress app listening...");
});
