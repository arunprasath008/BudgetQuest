const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require('mongoose');
const Plan = require('./model/Plan.model.js');
const User=require('./model/User.model.js');
const Wishlist=require('./model/Wishlist.model.js');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


const genAI = new GoogleGenerativeAI( process.env.API_KEY );
let model;

(async () => {
    try {
        
        model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Model initialized:", model);
    } catch (err) {
        console.error("Error initializing Generative Model:", err.message);
    }
})();


mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));


app.post('/gemini', async (req, res) => {
    const { query: location, days, budget: amount, people } = req.body;
    const prompt = `
        
Generate a travel plan for the following details with exact number of days:
  - Location: ${location}
  - Duration: ${days} Days
  - Number of People: ${people}
  - Budget: ${amount}

  The itinerary should be provided in JSON format without any comments and include the following fields:
  1. tripName
  2. duration
  3. budget
  4. bestTimetoVisit
  5. days: Each day should include :
    - dayNumber
    - theme
    
    - plan: A list of 4 places sort based on rating, where each place contains:
      - placeName 
      - placeDetails
      - placeImageUrl
      - description (150 words)
      -address(detailed address for placename)
      - geoCoordinates(lat-N/S , Lon-E/W)
      - ticketPricing
      - travelTime
      -rating for 5
    6. - hotel: A list of 2 hotels to stay, where each hotel contains:
        - hotelname
        - geoCoordinates(lat-N/S, Lon-E/W)
        - description
  7. - emergencyHub: A list of 4 emergency hubs (hospital, police station, fire service, bank), where each hub contains:
        - name
        - geoCoordinates(lat-N/S, Lon-E/W)for one location
        - address of the geocoordinates 

        Here’s the refined prompt for your recommendation requirements:

        Recommendations Details
        
        Clothes:
        Specify the type of clothes to be carried based on the weather conditions during the trip.
        
        Medicines:
        Provide a list of general medicines to be carried, including recommendations based on the bestTimetoVisit and the prevailing weather conditions.
        
        Food:
        Suggest the type of food suitable for consumption based on the tripName or the destination's cuisine.
        
        Currency:
        Recommend the type of currency required for the destination and the estimated amount needed based on the trip's budget.
  Ensure the response includes the JSON block properly formatted with necessary data and avoid giving "json three backticks" at starting and at ending and don't include any comments inside the json the hotel and emergency hub shpuld be at final for whole trip and dont add it in each day plan.
`;

    try {
        if (!model) {
            console.error("Model is not initialized.");
            return res.status(500).json({ error: "Model not available. Please try again later." });
        }

        const result = await model.generateContent(prompt);
      

        if (!result || !result.response) {
            console.error("Invalid response from model.");
            return res.status(500).json({ error: "Failed to generate travel plan." });
        }
       

        const tripData=result.response.text();
        console.log(tripData)
        res.status(200).json(tripData);
        const parse=JSON.parse(tripData);
        const newTrip = new Plan(parse);
        const savedTrip = await newTrip.save();
        console.log("Trip data saved:", savedTrip);
    } catch (err) {
        console.error("Error in /gemini route:", err.message);
        res.status(500).json({ error: "Internal server error." });
    }
});



app.post('/wishlist/add', async (req, res) => {
  const  {email ,carttrip}= req.body;
 try {
   
    let wishlist = await Wishlist.findOne({ email });
    if (!wishlist) {
    const newWishlist = new Wishlist({
      email,
      carttrip,
    });
    
    const save=await newWishlist.save();
    console.log(save);
    return res.status(200).json({ message: 'Item added to wishlist', wishlist: newWishlist });
  }
  const alreadyExists = carttrip.some((newItem) => 
      wishlist.carttrip.some((item) => item.placeName === newItem.placeName)
    );

    if (alreadyExists) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }
  wishlist.carttrip.push(...carttrip);
  await wishlist.save();  
  return res.status(200).json({ message: 'Item added to your Wishlist' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

 
  app.get('/wishlist/:email', async (req, res) => {
    const { email } = req.params;
  
    try {
      const wishlist = await Wishlist.findOne({ email });
  
      if (!wishlist) {
        return res.status(404).json({ message: 'No wishlist found for this user' });
      }
  
      res.status(200).json({ wishlist: wishlist.carttrip });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });








app.post('/user', async (req, res) => {
    const { username, email, password, isgoogleuser = false } = req.body;
console.log(username);
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
   
 
        const userdata = new User({ username, email, password, isgoogleuser });
        await userdata.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error("Error during user registration:", err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/loginvalid',async(req,res)=>{
  const{email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const Existinguser = await User.findOne({ email });
    if (!Existinguser) {
        return res.status(404).json({ message: 'Account does not exist' });
    }
    if (password !== Existinguser.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json(Existinguser);
  }
  catch(err){
    console.log("server error",err);
    res.status(500).json({message:'Server error'});
  }
})
app.post('/logingoogle',async(req,res)=>{
  const email =req.body.useremail;
  
  try {
    const Existinguser = await User.findOne({ email });
    if (!Existinguser) {
        return res.status(404).json({ message: 'Account does not exist' });
    }
    
    res.status(200).json(Existinguser);
  } 
  catch(err){
    console.log("server error",err);
    res.status(500).json({message:'Server error'});
  }
})
app.delete('/delete', async (req, res) => {
  const { email, placeName } = req.body;

  try {
    const deleteres = await Wishlist.updateOne(
      { email: email },
      { $pull: { carttrip: { placeName: placeName } } }
    );
    
    if (deleteres.modifiedCount > 0) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Unable to find" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/complete", async (req, res) => {
  const { email, placeName } = req.body;

  try {
    const updated = await Wishlist.updateOne(
      { email, "carttrip.placeName": placeName },
      { $set: { "carttrip.$.completed": true } }
    );

    if (updated.modifiedCount > 0) {
      res.status(200).send({ message: "Status updated successfully." });
    } else {
      res.status(400).send({ message: "No matching record found." });
    }
  } catch (error) {
    console.error("Error updating completion status:", error);
    res.status(500).send({ message: "Error updating completion status." });
  }
});

app.get("/profile/:email", async (req, res) => {
  const { email } = req.params;

  try {
  
    const wishlist = await Wishlist.find({ email: email });

    if (!wishlist.length) {
      return res.status(404).json({ message: "No data found for this user." });
    }

    res.status(200).json({
      email,
      wishlist,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error." });
  }
})

app.get('/',(req,res)=>{
  res.json("Hii, backend is running");
})
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});



