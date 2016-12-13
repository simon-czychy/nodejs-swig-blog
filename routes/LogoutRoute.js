var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, function (req,res,next) {
  console.log("LOGOUT");
  if (!req.body) return res.sendStatus(400);
  console.log(req.cookies);
    if(req.cookies.userid && req.cookies.email) {
      res.clearCookie("userid");
      res.clearCookie("email");
      res.redirect("/");
    }
    else {
      console.log(req.cookies);
      res.redirect("/");
    }
});

router.get('/', urlencodedParser, function (req,res) {
  console.log("LOGOUT");
    if(req.cookies.userid && req.cookies.email) {
      res.clearCookie("userid");
      res.clearCookie("email");
      res.redirect("/");
    }
    else {
      res.redirect("/");
    }
});

module.exports = router;
