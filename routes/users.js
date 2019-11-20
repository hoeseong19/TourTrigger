var express = require('express');
var bcrypt = require('bcrypt');
var User = require("../models/user");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.paginate({}, { page: 1, limit: 10 }, function(err, users) {
    if (err) {
      return next(err);
    }
    console.log("err", err);
    // result.docs
    // result.total
    // result.limit - 10
    // result.page - 3
    // result.pages
    res.render('users/index', {users: users.docs});
  });
});

router.get('/new', function(req, res, next) {
  res.render("users/new", {user: {}});
});

router.post('/', async function(req, res, next) {
  const saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);

  var user = new User({
    name: req.body.name, 
    email: req.body.email, 
    password: hash, 
    group: "tourist"
  });
  await user.save();
  res.redirect('/');
});

module.exports = router;
