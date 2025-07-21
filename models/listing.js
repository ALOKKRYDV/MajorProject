const { string } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review.js');
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
 
  description: {
    type: String,
  },

  image: {
  filename: {
    type: String,
    trim: true,
    default:"listingimage",
  },
  url: {
    type: String,
    trim: true,
    default:
      "https://bangkokhomequality.com/upload/tn_photo_2663.jpg",
    set: (v) =>
     v !== ""
        ? v
        : "https://bangkokhomequality.com/upload/tn_photo_2663.jpg",
  },
},

  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100  
  },
  country : {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100  
  },
  category :{
    type: String,
    enum: ["Trending",'Rooms','Iconic-cities','Mountains','Castels','Amazing-pool','Arctic','Farms','Camping'],
    required: true,
  },
reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
});

listingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await mongoose.model('Review').deleteMany({
      _id: {
        $in: doc.reviews
      }
    });
  }
});
  const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;