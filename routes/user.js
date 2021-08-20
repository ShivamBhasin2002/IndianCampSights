const express = require('express');
const passport = require('passport');
const router = express.Router();

const catchAsync = require("../utils/CatchAsync.js");

const {registerForm, registerUser, loginForm, loginUser, logOutUser} = require('../controlers/userController.js');

router.get('/register', registerForm);

router.post('/register', catchAsync(registerUser));

router.get('/login', loginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), loginUser);

router.get('/logout', logOutUser);

module.exports = router;