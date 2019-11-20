var express = require('express');
var User = require("../models/user");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/new', function(req, res, next) {
  res.render("users/new", {user: {}});
});

router.post('/', async function(req, res, next) {
  var user = new User({
    name: req.body.name, 
    email: req.body.email, 
    password: req.body.password, 
    group: "tourist"
  });
  await user.save();
  res.redirect('/');
});

module.exports = router;
