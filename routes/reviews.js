/* eslint no-underscore-dangle: ['error', {'allow': ['_id'] }] */
const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviews.createReview),
);

router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.destroyReview),
);

module.exports = router;
