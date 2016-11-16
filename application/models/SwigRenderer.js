exports.Render = function(res, path, options) {
  res.render(path,options);
}

exports.RenderIndex = function(res, loggedin, isAdmin) {
  res.render('index',  {
    title: 'Blog Sausage',
    isloggedin: loggedin || false,
    isAdmin: isAdmin || false
    
  });
}
