var express = require('express');
var Tour = require('../models/tour');
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

router.get('/:id', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  await tour.save();
  res.render('tours/show', {tour: tour});
});

router.post('/', async function(req, res, next) {
  var tour = new Tour({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    course: req.body.course
  });
  await tour.save();
  // req.flash('success', 'Successfully posted');
  res.redirect('/tours');
});

module.exports = router;
