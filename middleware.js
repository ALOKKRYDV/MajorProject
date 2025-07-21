const listings = require('./models/listing.js');
const reviews = require('./models/review.js');
const {listingSchema,reviewSchema} = require('./schema.js');
const expressError = require('./utils/expressError.js');

module.exports.islogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectTo = req.originalUrl; // Store the original URL
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectTo = (req, res, next) => {
    if (req.session.redirectTo) {
        res.locals.redirectTo = req.session.redirectTo; // Make redirectTo available in views
        delete req.session.redirectTo; // Clear the session variable after use
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id}= req.params;
    let listing = await listings.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing  = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new expressError(400, error.details[0].message);
    }
    next();
};

module.exports.validateReview  = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.reviews);
    if (error) {
        throw new expressError(400, error.details[0].message);
    }
    next();
};

module.exports.isAuther = async (req, res, next) => {
    let {id,reviewId}= req.params;
    let review = await reviews.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
}