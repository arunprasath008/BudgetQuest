import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays, DollarSign, Clock, Ticket, MapPin,Info } from "lucide-react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
// import { toast } from "react-hot-toast";
import { ToastContainer, toast } from 'react-toastify';
const UNSPLASH_API_KEY = "y9a0zjGlZAxJbelRiKSSyTZT92tmT97NBoVaUjOOrRk";
const WEATHER_API_KEY = "61bab5475d7d76b31b3e803e48099a56";

function View() {
  const [tripData, setTripData] = useState("");
  const [placeImages, setPlaceImages] = useState({});
  const [weatherData, setWeatherData] = useState({});
 
  // Fetch images for places
  const fetchImage = async (placeName) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${placeName}&per_page=1&client_id=${UNSPLASH_API_KEY}`
      );
      const imageUrl =
        response.data.results[0]?.urls?.regular ||
        "https://tse4.mm.bing.net/th?id=OIP.yULXd4mKfGiBwqKWoA7D0AHaEo&pid=Api&P=0&h=180";
      setPlaceImages((prev) => ({ ...prev, [placeName]: imageUrl }));
    } catch (error) {
      console.error(`Error fetching image for ${placeName}:`, error);
    }
  };

  // Parse geo-coordinates from string
  const parseCoordinates = (geoString) => {
    const match = geoString.match(
      /([-+]?[0-9]*\.?[0-9]+)°?\s*([NS]),\s*([-+]?[0-9]*\.?[0-9]+)°?\s*([EW])/
    );
    if (!match) return null;

    const lat = parseFloat(match[1]) * (match[2] === "S" ? -1 : 1);
    const lng = parseFloat(match[3]) * (match[4] === "W" ? -1 : 1);
    return { lat, lng };
  };

  // Fetch weather data for places
  const fetchWeather = async (lat, lon, placeName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      // console.log(response.data);
      const weather = {
        temperature: response.data.main.temp,
        condition: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
      };
      setWeatherData((prev) => ({ ...prev, [placeName]: weather }));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const addtrip = async(place)=>{
    const email = localStorage.getItem("Email");
    try {
        
      const response= await axios.post("https://ai-travelplanner-p721.onrender.com/wishlist/add", {
            email,
            carttrip: [place], 
          })
          toast.success(response.data.message || "Item added to your profile!");
      
          
        }
        
    catch(error){
      const errorMessage = error.response?.data?.message || "Failed to add item.";
      toast.error(errorMessage);
     
          };
          };
  

  useEffect(() => {
    try {
      const savedData = JSON.parse(localStorage.getItem("TripData"));
      setTripData(savedData);
      console.log("hotel",savedData.hotel)
      console.log("hosp",savedData.emergencyHub);
      

      if (savedData && savedData.days) {
        savedData.days.forEach((day) => {
          day.plan.forEach((place) => {
            if (place.placeName) {
              fetchImage(place.placeName);
              const coordinates = parseCoordinates(place.geoCoordinates);
              if (coordinates) {
                fetchWeather(coordinates.lat, coordinates.lng, place.placeName);
              }
            }
          });
        });
      }
    } catch (error) {
      console.error("Error parsing trip data:", error);
      setTripData(null);
    }
  }, []);

  if (!tripData || !tripData.days) {
    return <h2>No Trip Data Found</h2>;
  }

  const handleGeneratePDF = () => {
    console.log(tripData);
    const doc = new jsPDF();
  
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(tripData.tripName || "Trip Overview", 10, 10);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Duration: ${tripData.duration}`, 10, 20);
    doc.text(`Budget: ${tripData.budget}`, 10, 30);
  
    let yPosition = 40;
  
    for (const day of tripData.days) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day.dayNumber}: ${day.theme}`, 10, yPosition);
      yPosition += 10;
  
      for (const place of day.plan) {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 10;
        }
  
        doc.setFont("helvetica", "bold");
        doc.text(`Place: ${place.placeName}`, 10, yPosition);
        yPosition += 8;
  
        doc.setFont("helvetica", "normal");
        doc.text(`Details: ${place.placeDetails || "N/A"}`, 10, yPosition);
        yPosition += 8;
        
        doc.setFont("helvetica", "normal");
        doc.text(`Address: ${place.address || "N/A"}`, 10, yPosition);
        yPosition += 8;

        doc.setFont("helvetica", "normal");
        doc.text(`TravelTime: ${place.travelTime || "N/A"}`, 10, yPosition);
        yPosition += 8;

        doc.text(`Rating: ${place.rating || "N/A"}`, 10, yPosition);
        yPosition += 8;
      }
  
      yPosition += 10;
    }
  
    doc.save(`${tripData.tripName || "TripPlan"}.pdf`);
  };

  

  

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-green-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">
        {tripData.tripName}
      </h1>
      <div className="flex justify-end mb-6">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
              <Info className="w-6 h-6" />
              <span>Recommendations</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border p-4 shadow-lg rounded-lg ">
  <DialogHeader>
    <DialogTitle>Travel Recommendations</DialogTitle>
  </DialogHeader>
  <div className="text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <h2 className="text-lg font-bold mb-2">Clothes</h2>
      <ul className="list-disc list-inside">
        {tripData.clothes?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-bold mb-2">Medicines</h2>
      <ul className="list-disc list-inside">
        {tripData.medicines?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-bold mb-2">Food</h2>
      <ul className="list-disc list-inside">
        {tripData.food?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>

    <div>
      <h2 className="text-lg font-bold mb-2">Currency</h2>
      <ul className="list-disc list-inside">
        <li>Type: {tripData.currency?.type}</li>
        <li>Estimated Amount: {tripData.currency?.estimatedAmount}</li>
      </ul>
    </div>
  </div>
</DialogContent>


        </Dialog>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <CalendarDays className="w-6 h-6 text-blue-600 mr-2" />
            <p className="text-lg">
              <strong>Duration:</strong> {tripData.duration}
            </p>
          </div>
          <div className="flex items-center mb-4 md:mb-0">
            <DollarSign className="w-6 h-6 text-green-600 mr-2" />
            <p className="text-lg">
              <strong>Budget:</strong> {tripData.budget}
            </p>
          </div>
          <div className="flex items-center">
            <Clock className="w-6 h-6 text-orange-600 mr-2" />
            <p className="text-lg">
              <strong>Best Time:</strong> {tripData.bestTimetoVisit}
            </p>
          </div>
        </div>
      </div>
      
      {tripData.days.map((day, dayIndex) => (
        <div key={dayIndex} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-blue-700">
            Day {day.dayNumber}: {day.theme}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {day.plan.map((place, placeIndex) => {
              const coordinates = parseCoordinates(place.geoCoordinates);
              const weather = weatherData[place.placeName];
              return (
                <Dialog key={placeIndex}>
                  <DialogTrigger asChild>
                    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                      <div className="relative h-64">
                        <img
                          src={
                            placeImages[place.placeName] ||
                            "https://via.placeholder.com/600x400?text=Loading..."
                          }
                          alt={place.placeName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>
                        <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                          {place.placeName}
                        </h3>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-gray-600">{place.placeDetails}</p>
                          <div className="flex items-center gap-2">
                            <Star className="text-yellow-500 w-4 h-4" />
                            <span className="text-gray-600 font-medium">
                              {place.rating}
                            </span>
                          </div>
                        </div>

                        {weather && (
                          <div className="mb-4 flex items-center gap-4">
                            <img
                              src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                              alt={weather.condition}
                              className="w-8 h-8"
                            />
                            <p className="text-gray-700">
                              <strong>{weather.condition}</strong>,{" "}
                              {weather.temperature}°C
                            </p>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <Badge
                            variant="secondary"
                            className="flex items-center"
                          >
                            <Ticket className="w-4 h-4 mr-1" />
                            {place.ticketPricing}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="flex items-center"
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            {place.travelTime}
                          </Badge>
                        </div>
                        <Button className="w-full">
                          Explore More
                          <a className="w-4 h-4 ml-2" href="#"></a>
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>{place.placeName}</DialogTitle>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-4">
                      {coordinates && (
                        <MapContainer
                          center={coordinates}
                          zoom={13}
                          className="w-full h-64 rounded-lg"
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            // attribution="© OpenStreetMap contributors"
                          />
                          <Marker position={coordinates}></Marker>
                        </MapContainer>
                      )}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <p className="text-gray-700 mb-4">
                          {place.description}
                        </p>

                        <Badge
                          variant="secondary"
                          className="flex items-center"
                        >
                          <Ticket className="w-4 h-4 mr-1" />
                          {place.ticketPricing}
                        </Badge>
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {place.travelTime}
                        </Badge>
                        <Button onClick={() => addtrip(place)}>
                          Add to my trip
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-blue-700">
          Recommended Hotels
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {tripData.hotel.map((hotel, index) => {
            const coordinates = parseCoordinates(hotel.geoCoordinates);
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {hotel.hotelname}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{hotel.description}</p>
                  {coordinates && (
                    <MapContainer
                      center={coordinates}
                      zoom={15}
                      className="w-full h-48 rounded-lg mt-4"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={coordinates}></Marker>
                    </MapContainer>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
      </div>
      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-blue-700">
          Emergency Hub
        </h2>
        <div className="grid gap-8 md:grid-cols-2">
          {tripData.emergencyHub.map((place, index) => {
            const coordinates = parseCoordinates(place.geoCoordinates);
            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {place.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{place.address}</p>
                  {coordinates && (
                    <MapContainer
                      center={coordinates}
                      zoom={15}
                      className="w-full h-48 rounded-lg mt-4"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={coordinates}></Marker>
                    </MapContainer>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
      </div>
      <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
  <Link to={'/'}>
    <Button className="w-full md:w-auto">Back to Home</Button>
  </Link>
  <Button 
    onClick={handleGeneratePDF} 
    className="w-auto md:w-auto px-4 py-2 text-sm md:px-20"
  >
    Download Plan as PDF
  </Button>
</div>

      

      </div>
    
  );
}

export default View;
