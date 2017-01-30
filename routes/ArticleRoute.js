var router = express.Router();
var swig  = require("../application/models/SwigRenderer");

router.get('/show/:href', function(req, res) {
  if (!req) {
    res.send("empty-request");
  }
  Article.get(req.originalUrl.split("/")[3], function(err, cursor) {
    if(!cursor) {
      res.send("article-not-found");
    }
    else {
      cursor.next(function(err, article) {
        if(err) {
          console.log("[ERROR][manualLogin][CURSOR]: %s:%s\n%s", err.name, err.msg, err.message);
          swig.RenderError(res, err.name, err.msg);
        }
        else {
          if(req.cookies.userid && req.cookies.email) {
            Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
              if(user) {
                swig.Render(res, 'article/view', {
                  article: article,
                  isAdmin: Webuser.isUserAdmin(user),
                  isloggedin: true,
                  showSingleArticle: true
                });
              }
            });
          } else {
            swig.Render(res, 'article/view', {
              article: article,
              showSingleArticle: true
            });
          }
        }
      });
    }
  });
});


router.get('/edit/:href', function(req, res) {
  if (!req) {
    res.send("empty-request");
  }
  Article.get(req.originalUrl.split("/")[3], function(err, cursor) {
    if(!cursor) {
      res.send("article-not-found");
    }
    else {
      cursor.next(function(err, article) {
        if(err) {
          console.log("[ERROR][manualLogin][CURSOR]: %s:%s\n%s", err.name, err.msg, err.message);
        }
        else {
          if(req.cookies.userid && req.cookies.email) {
            Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
              if(user) {
                swig.Render(res, 'article/edit', {
                  article: article,
                  isAdmin: Webuser.isUserAdmin(user),
                  isloggedin: true,
                  showSingleArticle: true
                });
              }
            });
          } else {
            swig.Render(res, 'article/edit', {
              article: article,
              showSingleArticle: true
            });
          }
        }
      });
    }
  });
});


router.post('/add', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {

      Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
        if (!user) {
          res.send("not-loggedin");
        }
        else {
          var article = new ArticleModel(req.body.title, req.body.subtitle, req.body.content, req.body.tags, req.cookies.userid);

          Article.validate(article, function(err, validated) {
            if(!validated) {
              res.send("error");
            }
            else {
              Article.add(validated, function(connection, info) {
                if(!info) {
                  res.send("error");
                }
                else {
                  res.send("article-added");
                }
              });
            }
          })
        }
      });
  }
  else {
    //TODO: Error logging or smth like that
    swig.RenderIndex(res);
  }
});

router.post('/delete', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {

      Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
        if (!user) {
          res.send("not-loggedin");
        }
        else {
          Article.delete(req.body.id, function(connection, info) {
            if(!info) {
              res.send("error");
            }
            else {
              res.send("article-deleted");
            }
          });
        }
      });
  }
  else {
    //TODO: Error logging or smth like that
    swig.RenderIndex(res);
  }
});

router.post('/save', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {
      Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
        if (!user) {
          res.send("not-loggedin");
        }
        else {
          Article.update(req.body, function(connection, info) {
            if(!info) {
              res.send("error");
            }
            else {
              res.send("article-saved");
            }
          });
        }
      });
  }
  else {
    //TODO: Error logging or smth like that
    swig.RenderIndex(res);
  }
});

module.exports = router;
