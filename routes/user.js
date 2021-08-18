const express = require('express');
const passport = require('passport');
const router = express.Router();

const catchAsync = require("../utils/CatchAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const User = require('../models/user.js');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next(err);
            req.flash('Welcome to Indian Campgrounds!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), async (req, res) => {
    req.flash('success', 'welcome back!');
    let url = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(url);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/campgrounds');
});

module.exports = router;