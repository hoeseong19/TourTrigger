var express = require('express');
var Tour = require('../models/tour');
var Review = require('../models/review');
var router = express.Router();



router.get('/', function(req, res, next) {
  Tour.paginate({}, { page: 1, limit: 10 }, function(err, tours) {
    if (err) {
      return next(err);
    }
    console.log("err", err);
    // result.docs
    // result.total
    // result.limit - 10
    // result.page - 3
    // result.pages
    res.render('tours/index', {tours: tours.docs});
  });
});

router.get('/new', function(req, res, next) {
  res.render('tours/new', {tour: {}});
});

router.get('/:id/edit', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);

  res.render('tours/edit', {tour: tour});
});

router.get('/:id/reserve', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);

  res.render('tours/reserve', {tour: tour});
});

router.get('/:id', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  await tour.save();
  res.render('tours/show', {tour: tour});
});

router.put('/:id/update', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  const courses = $(".courselist li").toArray();

  const courselist = courses.map(function(course) {
    return course.innerText;
  });

  if (!tour) {
    req.flash('danger', 'Not existed tour');
    return res.redirect('back');
  }

  tour.title = req.body.title;
  tour.description = req.body.description;
  tour.price = req.body.price;
  tour.courses = courselist;

  await tour.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/tours');
});

router.delete('/:id', async function(req, res, next) {
  await Tour.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/tours');
});

router.post('/', async function(req, res, next) {
  // const user = req.session.user;
  const courses = $(".courselist li").toArray();

  var tour = new Tour({
    // author: user._id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
  });
  // tour.courses.remove();
  // var courselist = courses.map(function(course) {
  //   tour.courses.push(course.innerText);
  // });
  console.log(courses);
  await tour.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/tours');
});

router.post('/:id/review', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  const user = req.session.user;

  if (!tour) {
    return res.redirect('back');
  }

  var review = new Review({
    tour: tour._id,
    user: user._id,
    title: req.body.title,
    description: req.body.description
  });
  await review.save();
  await tour.save();

  req.flash('success', 'Successfully posted');
  res.redirect(`/tours/${req.params.id}`);
});

module.exports = router;
