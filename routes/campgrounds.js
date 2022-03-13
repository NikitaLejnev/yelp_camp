/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const router = express.Router();

router.get('/', wrapAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  wrapAsync(campgrounds.createCampground),
);

router.get('/:id', wrapAsync(campgrounds.showCampground));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.renderEditForm),
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  validateCampground,
  wrapAsync(campgrounds.updateCampground),
);

router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.destroyCampground),
);

module.exports = router;
