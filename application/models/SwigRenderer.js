exports.Render = function(res, path, options) {
  res.render(path,options);
}

exports.RenderIndex = function(res, loggedin, isAdmin) {
  res.render('index',  {
    isloggedin: loggedin || false,
    isAdmin: isAdmin || false
  });
}

exports.RenderError = function(res, name, error) {
  res.render('error',  {
    isloggedin: false,
    isAdmin: false,
    name: name,
    error: error
  });
}
