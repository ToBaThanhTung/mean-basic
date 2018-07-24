const express = require('express');
const router = express.Router();
const controllerMain = require('../controllers/main');
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');

// GET home page
router.get('/', ctrlLocations.homelist);
router.get('/locations', ctrlLocations.locationInfo);
router.get('/locations/reviews', ctrlLocations.addReview);

router.get('/about', ctrlOthers.about);


module.exports = router;
