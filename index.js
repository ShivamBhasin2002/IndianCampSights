const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');;
const localStratergy = require('passport-local');
const User = require('./models/user.js');

const ExpressError = require('./utils/ExpressError.js');

const campgroundRoutes = require('./routes/campground.js');
const reviewRoutes = require('./routes/review.js');
const userRoutes = require('./routes/user.js')

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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/users/login', '/'].includes(req.originalUrl))
        req.session.returnTo = req.originalUrl;
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//Index
app.get('/', (req, res) => {
    res.render("home");
});

//User Routes
app.use('/users', userRoutes);

//Campground Routes
app.use('/campgrounds', campgroundRoutes);

//Review Routes
app.use('/campgrounds/:id/review', reviewRoutes);

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