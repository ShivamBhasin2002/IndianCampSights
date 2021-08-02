const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/indian-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Index
app.get('/', (req, res) => {
    res.render("home");
});

//Show All
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds: campgrounds });
});


//New Form
app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new");
});

//Show one
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground: campground });
});

//Create New
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

//Edit Form
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground: campground });
});

//Edit Campground
app.put('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

//Delete Campground
app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds/');
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(process.env.PORT || 3000);
    console.log("Server Started");
})