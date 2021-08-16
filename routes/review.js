const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/CatchAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else
        next();
}

//Create Review
router.post('/', validateReview, catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${req.params.id}`);
}));

//Delete Review
router.delete('/:revId', catchAsync(async(req, res) => {
    const { id, revId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: revId } });
    await Review.findByIdAndDelete(revId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;