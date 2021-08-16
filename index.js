const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError.js');

const campgrounds = require('./routes/campground.js');
const reviews = require('./routes/review.js');

mongoose.connect('mongodb://localhost:27017/indian-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(flash());

const sessionConfig = {
    secret: 'IDK wtf this is',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 604800000,
        maxAge: 604800000
    }
}
app.use(session(sessionConfig));

//Index
app.get('/', (req, res) => {
    res.render("home");
});

//Campground Routes
app.use('/campgrounds', campgrounds);

//Review Routes
app.use('/campgrounds/:id/review', reviews);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(process.env.PORT || 3000);
    console.log("Server Started");
});