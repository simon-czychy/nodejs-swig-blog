var router = express.Router();
var swig  = require("../application/models/SwigRenderer");

router.get('/show/:href', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {
    Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
      if (!user) {
        res.send("not-loggedin");
      }
      else {
        console.log(req);
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
                swig.Render(res, 'article/view', {
                  article: article,
                  isAdmin: user.level === "admin",
                  isloggedin: true,
                  showSingleArticle: true
                });
              }
            });
          }
        });
      }
    });
  }
  else {
    if (!req) {
      res.send("request-broken");
    }
    else {
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
              swig.Render(res, 'articleview', {
                article: article,
                isAdmin: false,
                showSingleArticle: true
              });
            }
          });
        }
      });
    }
  }
});

router.get('/edit/:href', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {
    Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
      if (!user) {
        res.send("not-loggedin");
      }
      else {
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
                swig.Render(res, 'article/edit', {
                  article: article,
                  isAdmin: user.level === "admin",
                  isloggedin: true,
                  showSingleArticle: true
                });
              }
            });
          }
        });
      }
    });
  }
  else {
    if (!req) {
      res.send("request-broken");
    }
    else {
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
              swig.Render(res, 'articleview', {
                article: article,
                isAdmin: false,
                showSingleArticle: true
              });
            }
          });
        }
      });
    }
  }
});

router.get('/show/:href', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {
    Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
      if (!user) {
        res.send("not-loggedin");
      }
      else {
        console.log(req);
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
                swig.Render(res, 'article/edit', {
                  article: article,
                  isAdmin: user.level === "admin",
                  isloggedin: true,
                  showSingleArticle: true
                });
              }
            });
          }
        });
      }
    });
  }
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
    swig.RenderIndex(res);
  }
});


router.post('/get', function(req, res) {
  if(req.cookies.userid && req.cookies.email) {
      Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function (connection, user) {
        if (!user) {
          res.send("not-loggedin");
        }
        else {
          Article.getArticle(req.body.href, function(connection, info) {
            if(!info || typeof info == "undefined") {
              res.send("error");
            }
            else {
              res.send("article-loaded");
            }
          });
        }
      });
  }
  else {
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
    swig.RenderIndex(res);
  }
});


/* GET article page. */
router.get('/', function(req, res, next) {
  //TODO
});

module.exports = router;
