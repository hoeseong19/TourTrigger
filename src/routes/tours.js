const express = require('express');
const Tour = require('../models/tour');
const Guide = require('../models/guide');
const Review = require('../models/review');
const Reservation = require('../models/reservation');
const Course = require("../models/course");
const Geonames = require('geonames.js');
const router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

router.get('/', function(req, res, next) {
  const geonames = new Geonames({
    username: 'hoeseong19',
    lan: 'en',
    encoding: 'JSON'
  });

  const page = parseInt(req.query.page) || 1;

  var query = {};

  var option = { page: page, limit: 10, populate: 'guide' };

  const category = req.query.category;
  if (category)
    query.category = category;

  const sort = req.query.sort;

  if(sort == 'review') {
    option.sort = {numReviews: -1};
  } else if(sort == 'price') {
    option.sort = {price: -1};
  } else if(sort == 'new') {
    option.sort = {reg_date: -1};
  } else {
    option.sort = {numReserves: -1};
  }
  

  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}}
    ]};
  }

  geonames.search({q: 'CONT'}) //get continents
  .then(resp => {
    console.log("continents?????", resp.geonames);
    res.app.locals.continents = resp.geonames;
  })
  .catch(err => console.error(err));

  Tour.paginate(query, option, function(err, tours) {
    if (err) {
      return next(err);
    }
    console.log("err", err);
    
    res.render('tours/index', {tours: tours, term: term, query: req.query});
  });
});

router.get('/new', function(req, res, next) {
  res.render('tours/new', {tour: {}});
});

router.get('/:id/edit', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  const courses = await Course.find({tour: tour._id});

  res.render('tours/edit', {tour: tour, courses: courses});
});

router.get('/:id/reserve', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);

  res.render('tours/reserve', {tour: tour});
});

router.get('/:id', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id).populate('guide');
  const courses = await Course.find({tour: tour._id});
  const reviews = await Review.find({tour: tour._id});

  await tour.save();
  res.render('tours/show', {tour: tour, courses: courses, reviews: reviews});
});

router.put('/:id/update', needAuth, async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  const guide = await Guide.findOne({user: req.user.id});

  if (!tour) {
    req.flash('danger', 'Not existed tour');
    return res.redirect('back');
  }

  tour.title = req.body.title;
  tour.description = req.body.description;
  tour.price = req.body.price;
  tour.category = req.body.category; 
  tour.image = req.body.image;
  tour.city = guide.city;

  await tour.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/tours');
});

router.delete('/:id', needAuth, async function(req, res, next) {
  await Tour.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/tours');
});

router.post('/', needAuth, async function(req, res, next) {
  const user = req.user;
  const guide = await Guide.findOne({user: user._id});

  var tour = new Tour({
    guide: guide._id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image, 
    category: req.body.category, 
    city: guide.city
  });
  await tour.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/tours');
});

router.post('/:id/course', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return res.redirect('back');
  }

  var course = new Course({
    tour: tour._id,
    title: req.body.coursetitle,
    description: req.body.coursedescription, 
    required_time: req.body.courserequired_time, 
    latitude: req.body.courselat, 
    longitude: req.body.courselng
  });
  await course.save();
  await tour.save();

  req.flash('success', 'Successfully posted');
  res.redirect(`/tours/${req.params.id}`);
});

router.post('/:id/review', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  const user = User.findById(userId);

  if (!tour) {
    return res.redirect('back');
  }

  var review = new Review({
    tour: tour._id,
    user: user._id,
    description: req.body.description
  });
  await review.save();
  await tour.save();

  req.flash('success', 'Successfully posted');
  res.redirect(`/tours/${req.params.id}`);
});

router.post('/:id/reserve', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  const user = req.user;

  if (!tour) {
    return res.redirect('back');
  }

  var reservation = new Reservation({
    tour: tour._id,
    user: user._id,
    reserved_date: req.body.reserved_date,
    people: req.body.people
  });
  tour.numReserves++;
  await reservation.save();
  await tour.save();

  req.flash('success', 'Successfully reserved');
  res.redirect(`/users/${user.id}`);
});

module.exports = router;
