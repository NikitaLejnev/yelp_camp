/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
const express = require('express');
const multer = require('multer');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const { storage } = require('../cloudinary');

const upload = multer({ storage });
const router = express.Router();

router.route('/')
  .get(wrapAsync(campgrounds.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
  .get(wrapAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    wrapAsync(campgrounds.updateCampground),
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.destroyCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.renderEditForm),
);

module.exports = router;
