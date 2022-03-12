/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
/* eslint no-unused-vars: ['error', {'argsIgnorePattern': 'res|next' }] */
const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const { loggedIn } = require('../middleware');

const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join('.');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get('/', wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', loggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', loggedIn, validateCampground, wrapAsync(async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  req.flash('success', 'Successfully created a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', wrapAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews');
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', loggedIn, wrapAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/edit', { campground });
}));

router.put('/:id', loggedIn, validateCampground, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', loggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a campground!');
  res.redirect('/campgrounds');
}));

module.exports = router;
