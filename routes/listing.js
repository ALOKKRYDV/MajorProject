const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {islogin, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {cloudinary, storage} = require('../cloudconfig.js');
const upload = multer({ storage }); // Directory to store uploaded files 

//Index Route
router.get('/', wrapAsync(listingController.index));

// New Listing Route
router.get('/new',islogin, listingController.renderNewListingForm);

// Create Route
router.post('/',islogin,validateListing,upload.single('image[url]'), wrapAsync(listingController.createListing));


// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Edit Route
router.get('/:id/edit',islogin,isOwner, wrapAsync(listingController.editListing));

// Update Route
router.put('/:id',islogin,validateListing,upload.single('image[url]'), wrapAsync(listingController.updateListing));

// Delete Route
router.delete('/:id',islogin,isOwner, wrapAsync(listingController.deleteListing));



module.exports = router;