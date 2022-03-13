/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

const router = express.Router();

router.get('/', wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully created a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id', wrapAsync(async (req, res) => {
  const campground = await (await Campground.findById(req.params.id).populate('reviews').populate('author'));
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated a campground!');
  return res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a campground!');
  res.redirect('/campgrounds');
}));

module.exports = router;
