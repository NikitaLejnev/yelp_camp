/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const Campground = require('../models/campground');
const cloudinary = require('../cloudinary');

const mapToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapToken });

const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

const renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

const createCampground = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully created a campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

const showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author',
    },
  }).populate('author');
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
  const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    await req.body.deleteImages.forEach((image) => {
      cloudinary.cloudinary.uploader.destroy(image);
    });
    await campground.updateOne({
      $pull: {
        images: { filename: { $in: req.body.deleteImages } },
      },
    });
  }
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
