const express = require('express');
const router = express.Router();

const catchAsync = require("../utils/CatchAsync.js");
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');

const Campground = require('../models/campground');

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
    const campground = await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    res.render("campgrounds/show", { campground: campground });
}));

//Create New
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Edit Form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground: campground });
}));

//Edit Campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully edited campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete Campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds/');
}));

module.exports = router;