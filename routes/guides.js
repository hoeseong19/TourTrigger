var express = require('express');
var User = require("../models/user");
var Guide = require("../models/guide");
var Reservation = require("../models/reservation");
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET guides listing. */
router.get('/', function(req, res, next) {
  const page = parseInt(req.query.page) || 1;

  Guide.paginate({}, { page: page, limit: 10, populate: 'user' }, function(err, guides) {
    if (err) {
      return next(err);
    }
    console.log("err", err);
    res.render('guides/index', {guides: guides});
  });
});

router.get('/new', needAuth, function(req, res, next) {
  res.render("guides/new", {guide: {}});
});

router.get('/:id', async function(req, res, next) {
  const guide = await Guide.findById(req.params.id);
  await guide.save();
  res.render("guides/show", {guide: guide});
});

router.post('/', async function(req, res, next) {
  const user = req.session.user;
  user.guide = true;

  var guide = new Guide({
    user: user._id, 
    name: req.body.name, 
    description: req.body.description, 
    city: req.body.city
  });
  await user.save();
  await guide.save();
  res.redirect('/');
});

module.exports = router;
