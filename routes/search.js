const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const listingController = require('../controllers/search.js');

router.get('/', wrapAsync(listingController.searchListing));
router.get("/filter/:category",wrapAsync(listingController.searchCategory));
module.exports = router;