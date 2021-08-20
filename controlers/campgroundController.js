const Campground = require('../models/campground');

module.exports.showAllCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: campgrounds });
};

module.exports.newCampgroundForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.showOneCampground = async (req, res) => {
    const campground = await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'));
    res.render("campgrounds/show", { campground: campground });
};

module.exports.createNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.editCampgroundForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground: campground });
};

module.exports.editCampground = async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully edited campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds/');
};