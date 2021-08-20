const express = require('express');
const router = express.Router();

const catchAsync = require("../utils/CatchAsync.js");
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware.js');

const {showAllCampgrounds, 
    newCampgroundForm, 
    showOneCampground,
    createNewCampground, 
    editCampgroundForm, 
    editCampground,
    deleteCampground} = require('../controlers/campgroundController.js');

//Show All
router.get('/', catchAsync(showAllCampgrounds));

//New Form
router.get('/new', isLoggedIn, newCampgroundForm);

//Show one
router.get('/:id', catchAsync(showOneCampground));

//Create New
router.post('/', isLoggedIn, validateCampground, catchAsync(createNewCampground));

//Edit Form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(editCampgroundForm));

//Edit Campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(editCampground));

//Delete Campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCampground));

module.exports = router;