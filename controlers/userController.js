const User = require('../models/user.js');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res) => {
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
};

module.exports.loginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'welcome back!');
    let url = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(url);
};

module.exports.logOutUser = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out');
    res.redirect('/campgrounds');
};