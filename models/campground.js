const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});
ImageSchema.virtual('thumbnail').get(function(){ // can chain other schemas in side Schemas
  return this.url.replace('/upload', '/upload/w_200')
});
// TO ADD PROPERTIES / VURTUALS TO CAMPGROUND OBJECT
const opts = { toJSON: { virtuals: true } }; 

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: [ 'Point'], // has to be Point
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
}, opts); // ADD OPTS FROM ABOVE, COLT FOUND THIS OUT

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
  return `<strong><a href="/campgrounds/${this._id}" style="text-decoration: none;">
      ${this.title}</a></strong>
      <p>${this.description.substring(0, 20)}...</p>
      <p>${this.location}</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function(doc){ // post middleware function
  if(doc){
    await Review.deleteMany({ _id: { $in: doc.reviews }})// removes associated reviews from Campground instance
  } 
  console.log(doc)
})

const campground = mongoose.model('Campground', CampgroundSchema);

module.exports = campground;

