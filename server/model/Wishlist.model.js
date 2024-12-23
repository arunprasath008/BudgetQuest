const mongoose = require('mongoose');

 const wishlistSchema= new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    carttrip: [
        {
          placeName: String,
          placeDetails: String,
          placeImageUrl: String,
          description:String,
          address:String,
          geoCoordinates:String,
          ticketPricing: String,
          travelTime: String,
          addedAt: { type: Date, default: Date.now },
          completed: { type: Boolean, default: false }
        }]

 }
 )
 const wishlist = mongoose.model('cart', wishlistSchema);
 module.exports= wishlist;

