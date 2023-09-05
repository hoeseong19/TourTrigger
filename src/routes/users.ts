var express = require('express');
var User = require("../models/user");
var Guide = require("../models/guide");
var Tour = require("../models/tour");
var Reservation = require("../models/reservation");
export const router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

function validateForm(form, options) {
  var name = form.name || "";
  var email = form.email || "";
  name = name.trim();
  email = email.trim();

  if (!name) {
    return 'Name is required.';
  }

  if (!email) {
    return 'Email is required.';
  }

  if (!form.password && options.needPassword) {
    return 'Password is required.';
  }

  if (form.password !== form.password_confirmation) {
    return 'Passsword do not match.';
  }

  if (form.password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null;
}

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

router.get('/:id/edit', async function(req, res, next) {
  const user = await User.findById(req.params.id);

  res.render('users/edit', {user: user});
});

router.get('/:id', needAuth, async function(req, res, next) {
  var user = await User.findById(req.params.id);
  var guide = await Guide.findOne({user: user._id});
  var tmp = [];
  var reservations = await Reservation.find({user: user.id});
  for (var reservation of reservations) {
    tmp.push(reservation.tour);
  }

  var tours = await Tour.find({_id : { $in: tmp }}).populate('guide');

  await user.save();
  if(user.guide)
    res.render("users/show", {user: user, guide: guide, tours: tours});
  else
    res.render("users/show", {user: user, tours: tours}); 
});

router.put('/:id/update', needAuth, async function(req, res, next) {
  const user = await User.findById(req.params.id);

  user.name = req.body.name;
  user.image = req.body.image;

  await user.save();
  req.flash('success', 'Successfully updated');
  res.redirect(`/users/${user.id}`);
});

router.delete('/:id/reserve', needAuth, async function(req, res, next) {
  const user = await User.findOne({_id: req.params.id});
  await Reservation.findOneAndDelete({user: user.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/tours');
});

router.delete('/:id', needAuth, async function(req, res, next) {
  await User.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/tours');
});

router.post('/', async function(req, res, next) {
  var err = validateForm(req.body, {needPassword: true});
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var user = await User.findOne({email: req.body.email});
  console.log('USER???', user);
  if (user) {
    req.flash('danger', 'Email address already exists.');
    return res.redirect('back');
  }
  user = new User({
    name: req.body.name,
    email: req.body.email,
  });
  user.password = await user.generateHash(req.body.password);
  await user.save();
  req.flash('success', 'Registered successfully. Please sign in.');
  res.redirect('/');
});
