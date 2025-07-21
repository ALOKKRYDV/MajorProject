const joi = require('joi');
const Review = require('./models/review');

const listingSchema = joi.object({
    title: joi.string().required().min(1).max(100),
    description: joi.string(),
    image: joi.object({
        filename: joi.string().trim().default("listingimage"),
        url: joi.string().trim().uri().allow('', null).default("https://bangkokhomequality.com/upload/tn_photo_2663.jpg")
    }),
    price: joi.number().required().min(0),
    location: joi.string().required().min(1).max(100),
    country: joi.string().required().min(1).max(100)

});

const reviewSchema = joi.object({
    comment: joi.string().required(),
    rating: joi.number().min(1).max(5),
    createdAt: joi.date().default(() => new Date())
});
module.exports ={listingSchema,reviewSchema} ;