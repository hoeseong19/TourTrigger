var express = require('express');
var User = require("../models/user");
var bcrypt = require('bcryptjs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TourTrigger' });
});

module.exports = router;
