var express = require('express');
var router = express.Router();

var userRoutes = require('./users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/post');
});

router.use(userRoutes);


module.exports = router;
