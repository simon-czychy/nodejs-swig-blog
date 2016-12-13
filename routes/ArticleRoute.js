var router = express.Router();
var swig  = require("../application/models/SwigRenderer");


/* GET article page. */
router.get('/show', function(req, res) {

  if(req.cookies.userid && req.cookies.email) {
    //TODO
  }
  else {
    swig.Render(res, 'article', {
      isloggedin: false,
      method: 'show'
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
              console.log("Could not validate article!");
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
          Article.getArticle(req.body.id, function(connection, info) {
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
          Article.saveArticle(req.body.id, function(connection, info) {
            if(!info || typeof info == "undefined") {
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


/* GET article page. */
router.get('/', function(req, res, next) {
  //TODO
});

module.exports = router;
