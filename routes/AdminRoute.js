var router = express.Router();
var swig  = require("../application/models/SwigRenderer");

/* GET admin page. */
router.get('/', function(req, res, next) {
  if(req.cookies.userid && req.cookies.email) {
    Webuser.autoLogin(req.cookies.userid, req.cookies.email, res, function(connection, user) {
      if(!user || typeof user == "undefined") {
        swig.Render(res, "error", {
          status: 404,
        });
      }
      else {
        swig.Render(res, "admin", {
          "isloggedin": true,
          "isAdmin": user.level === "admin"
        });
      }
    });
  }
  else {
    swig.Render(res, "error", {
      status: 404,
    });
  }
});

module.exports = router;
