const Review = require('../models/review');
const listing = require("../models/listing.js");

module.exports.postReview = async (req, res) => {
    let {id}=req.params;
    let result = await listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // Set the author to the currently logged-in user
    console.log(newReview);
    await newReview.save();
    result.reviews.push(newReview);
    await result.save(); 
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}