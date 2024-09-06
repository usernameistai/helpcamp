const express = require('express');
const router = express.Router({ mergeParams: true }); // remember this
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor  } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
// const Campground = require('../models/campground');
// const Review = require('../models/review');

//REVIEW ROUTES
// owing to app.use('/campgrounds/:id/reviews', campgrounds/:id/reviews) => have removed the /campgrounds/:id/reviews from the app.get etc.
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));


router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;