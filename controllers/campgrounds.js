/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
const Campground = require('../models/campground');

const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

const renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

const createCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully created a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

const showCampground = async (req, res) => {
  const campground = await (await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author',
    },
  }).populate('author'));
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/show', { campground });
};

const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Campground not found');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/edit', { campground });
};

const updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated a campground!');
  return res.redirect(`/campgrounds/${campground._id}`);
};

const destroyCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a campground!');
  res.redirect('/campgrounds');
};

module.exports = {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  updateCampground,
  destroyCampground,
};
