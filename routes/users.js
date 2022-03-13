const express = require('express');
const passport = require('passport');

const wrapAsync = require('../utils/wrapAsync');
const users = require('../controllers/users');

const router = express.Router();

router.route('/register')
  .get(users.renderRegister)
  .post(wrapAsync(users.register));

router.route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    users.login,
  );

router.get('/logout', users.logout);

module.exports = router;
