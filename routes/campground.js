const express = require('express');
const router = express.Router();

const catchAsync = require("../utils/CatchAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require('../middleware.js');

const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else
        next();
}

//Show All
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: campgrounds });
}));


//New Form
router.get('/new', isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//Show one
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", { campground: campground });
}));

//Create New
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Edit Form
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground: campground });
}));

//Edit Campground
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully edited campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete Campground
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds/');
}));

module.exports = router;