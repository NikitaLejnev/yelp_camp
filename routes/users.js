const express = require('express');
const passport = require('passport');

const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', wrapAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    await User.register(user, password);
    req.flash('success', 'Welcome to YelpCamp!');
    res.redirect('campgrounds');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post(
  '/login',
  passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
  (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
  },
);

module.exports = router;
