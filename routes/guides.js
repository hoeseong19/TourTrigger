var express = require('express');
var Guide = require("../models/guide");
var Reservation = require("../models/reservation");
const cities = require("all-the-cities-mongodb");
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
var router = express.Router();

/* GET guides listing. */
router.get('/', function(req, res, next) {
  const page = parseInt(req.query.page) || 1;

  User.paginate({populate: 'user'}, { page: page, limit: 10 }, function(err, guides) {
    if (err) {
      return next(err);
    }
    console.log("err", err);
    res.render('guides/index', {guides: guides});
  });
});

router.get('/new', function(req, res, next) {
  const countries = [...new Set(cities.map(city => city.country))];

  res.render("guides/new", {guide: {}, countries: countries});
});

router.get('/:id', async function(req, res, next) {
  const guide = await Guide.findById(req.params.id);
  await guide.save();
  res.render("guides/show", {guide: guide});
});

router.post('/', async function(req, res, next) {

  var guide = new Guide({
    name: req.body.name, 
    description: req.body.description, 
    password: hash
  });
  await guide.save();
  res.redirect('/');
});

module.exports = router;
