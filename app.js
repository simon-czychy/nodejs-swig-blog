var express = require('express');
var path = require('path');
// Default Route for Index
var IndexRoute = require('./routes/IndexRoute');

//create express instance
var app = express();

//set port
app.set('port', 80);

//set views directory
app.set('views', path.join(__dirname, 'views'));

//set vieew engine
app.set('view engine', 'pug');

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
    message: err.message,
    error: err
  });
});

//export
module.exports = app;

//listen on given port
app.listen(app.get('port'));
