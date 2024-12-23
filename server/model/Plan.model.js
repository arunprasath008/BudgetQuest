const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
 
    tripName: String,
    duration: String,
    budget: String,
    bestTimetoVisit: String,
     days: [
      {             
        dayNumber: Number,
        theme: String,
        plan: [
          {
            placeName: String,
            placeDetails: String,
            placeImageUrl: String,
            description:String,
            geoCoordinates: String,
            ticketPricing: String,
            travelTime: String,
          },
        ],
       },
    ]
  });


const Plan= mongoose.model('Plan', tripSchema);

module.exports = Plan;


