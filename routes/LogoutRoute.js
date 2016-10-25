var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/', urlencodedParser, function (req,res,next) {
  if (!req.body) return res.sendStatus(400);
    if(req.cookies.userid && req.cookies.email) {
      res.clearCookie("userid");
      res.clearCookie("email");
      res.end();
    }
});

module.exports = router;
