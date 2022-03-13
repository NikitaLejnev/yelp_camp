/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
const Campground = require('./models/campground');
const { campgroundSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const { reviewSchema } = require('./schemas');

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in');
    return res.redirect('/login');
  }
  return next();
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You are not allowed to do it!');
    return res.redirect(`/campgrounds/${id}`);
  }
  return next();
};

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join('.');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join('.');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isAuthor,
  validateCampground,
  validateReview,
};
