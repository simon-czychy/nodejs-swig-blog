var express = require('express');
var cons = require('consolidate');
var cookieParser = require('cookie-parser');


// Default Route for Index
var IndexRoute = require('./routes/IndexRoute');
var LoginRoute = require('./routes/LoginRoute');
var LogoutRoute = require('./routes/LogoutRoute');
var AdminRoute = require('./routes/AdminRoute');

//create express instance
var app = express();
app.use(cookieParser());
//set port
app.set('port', 80);



// set view engine to swig
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', 'application/views');


//set folder for static files like css, js, etc. to be served
app.use('/static', express.static(__dirname + '/static'));

//Route to Index
app.use('/', IndexRoute);
app.use('/login', LoginRoute);
app.use('/logout', LogoutRoute);
app.use('/admin', AdminRoute);



// catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Display errors from twig etc.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      status: err.status,
      message: err.message,
      error: err.stack
  });
});


//export
module.exports = app;

//listen on given port
app.listen(app.get('port'), function() {
  console.log("PHPExpress app listening...");
});
