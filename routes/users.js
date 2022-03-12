const express = require('express');

const User = require('../models/user');
const router = require('./reviews');
const wrapAsync = require('../utils/wrapAsync');

const routes = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', wrapAsync(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Welcome to YelpCamp!');
    res.redirect('campgrounds');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
}));

module.exports = router;
