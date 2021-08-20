const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/CatchAsync.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const {createNewReview, deleteReview} = require('../controlers/reviewsController');

//Create Review
router.post('/', isLoggedIn, validateReview, catchAsync(createNewReview));

//Delete Review
router.delete('/:revId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;