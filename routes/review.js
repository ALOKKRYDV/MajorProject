const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {islogin, validateReview,isAuther } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

//post review
router.post('/',islogin,validateReview, wrapAsync(reviewController.postReview));
//delete review
router.delete('/:reviewId',islogin,isAuther, wrapAsync(reviewController.deleteReview));

module.exports = router;