const express = require('express');
const TourController = require('../controllers/tour.controller');

const router = express.Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('danger', 'Please signin first.');
        res.redirect('/signin');
    }
}

const tourController = new TourController();

router.get('/', tourController.getListTour);

router.get('/new', tourController.getCreateTourPage);

router.get('/:id/edit', tourController.getEditTourPage);

router.get('/:id/reserve', tourController.getReserveTourPage);

router.get('/:id', tourController.getTour);

router.put('/:id/update', needAuth, tourController.updateTour);

router.delete('/:id', needAuth, tourController.deleteTour);

router.post('/', needAuth, tourController.createTour);

router.post('/:id/course', tourController.createTourCourse);

router.post('/:id/review', tourController.createTourReview);

router.post('/:id/reserve', tourController.createTourReserve);

module.exports = router;
