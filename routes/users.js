var express = require('express');
var bcrypt = require('bcrypt');
var User = require("../models/user");
var Reservation = require("../models/reservation");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const page = parseInt(req.query.page) || 1;

  User.paginate({}, { page: page, limit: 10 }, function(err, users) {
    if (err) {
      return next(err);
    }
    console.log("err", err);
    res.render('users/index', {users: users});
  });
});

router.get('/new', function(req, res, next) {
  res.render("users/new", {user: {}});
});

router.get('/:id', async function(req, res, next) {
  const user = await User.findById(req.params.id);
  await user.save();
  res.render("users/show", {user: user});
});

router.post('/', async function(req, res, next) {
  const saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);

  var user = new User({
    name: req.body.name, 
    email: req.body.email, 
    password: hash
  });
  await user.save();
  res.redirect('/');
});

module.exports = router;
