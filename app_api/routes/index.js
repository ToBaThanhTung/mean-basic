const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');

router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationCreate);
router.get('/locations/:locationId', ctrlLocations.locationReadOne);
router.put('/locations/:locationId', ctrlLocations.locationUpdateOne);
router.delete('/location/:locationId', ctrlLocations.locationDeleteOne);


router.post('locations/:locationId/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationId/reviews/reviewId', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId', ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId', ctrlReviews.reviewsDeleteOne);

module.exports = router;
