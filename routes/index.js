var express = require('express');
var User = require("../models/user");
var bcrypt = require('bcryptjs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TourTrigger' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

router.get('/signout', function(req, res, next) {
  delete req.session.user;
  req.flash('success', 'Successfully signed out.');
  res.redirect('/');
});

router.post('/signin', function(req, res, next) { 
  User.findOne({email: req.body.email}, function(err, user){
    if (err) {
      res.render('error', {message: "Error", error: err});
    } else if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      req.flash('danger', 'Invalid username or password.');
      res.redirect('back');
    } else {
      req.session.user = user;
      req.flash('success', 'Welcome!');
      res.redirect('/');
    }
  });
});

module.exports = router;
