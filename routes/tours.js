const express = require('express');
const Tour = require('../models/tour');
const Review = require('../models/review');
const Reservation = require('../models/reservation');
const Course = require("../models/course");
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

function needAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

router.get('/', function(req, res, next) {
  const page = parseInt(req.query.page) || 1;

  Tour.paginate({}, { page: page, limit: 10 }, function(err, tours) {
    if (err) {
      return next(err);
    }
    console.log("err", err);
    
    res.render('tours/index', {tours: tours});
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
  const tour = await Tour.findById(req.params.id);
  const courses = await Course.find({tour: tour._id});
  const reviews = await Review.find({tour: tour._id});

  await tour.save();
  res.render('tours/show', {tour: tour, courses: courses, reviews: reviews});
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

const mimetypes = {
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/png": "png"
};
const upload = multer({
  dest: 'tmp', 
  fileFilter: (req, file, cb) => {
    var ext = mimetypes[file.mimetype];
    if (!ext) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

router.post('/', needAuth, upload.single('image'), async function(req, res, next) {
  const user = req.session.user;

  var tour = new Tour({
    author: user._id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
  });
  if (req.file) {
    const dest = path.join(__dirname, '../public/images/uploads/');  // 옮길 디렉토리
    console.log("File ->", req.file); // multer의 output이 어떤 형태인지 보자.
    const filename = tour._id + "/" + req.file.originalname;
    await fs.move(req.file.path, dest + filename);
    tour.image = "/images/uploads/" + filename;
  }
  await tour.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/tours');
});

router.post('/:id/course', async function(req, res, next) {
  const tour = await Tour.findById(req.params.id);
  const user = User.findById(userId);

  if (!tour) {
    return res.redirect('back');
  }

  var course = new Course({
    tour: tour._id,
    title: req.body.coursetitle,
    description: req.body.coursedescription, 
    required_time: req.body.courserequired_time
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

module.exports = router;
