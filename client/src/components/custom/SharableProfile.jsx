import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Ticket } from "lucide-react";

export default function SharableProfile({ match }) {
  const [wishlist, setWishlist] = useState([]);
  const email = match.params.email;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://ai-travelplanner-p721.onrender.com/${email}`);
        setWishlist(response.data.wishlist || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchData();
  }, [email]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-foreground h-32" />
        <CardHeader className="relative pb-8">
          <div className="text-center w-full">
            <CardTitle className="text-2xl font-bold">{email}</CardTitle>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Clock className="mr-2 h-6 w-6 text-primary" />
          Wishlist
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-visible transition-shadow hover:shadow-lg"
            >
              <CardHeader className="relative bg-primary/5 pb-4">
                <CardTitle className="mt-2">{item.placeName}</CardTitle>
                <CardDescription>{item.placeDetails}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-4">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <Badge variant="secondary" className="flex items-center">
                    <Ticket className="w-4 h-4 mr-1" />
                    {item.ticketPricing}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {item.travelTime}
                  </Badge>
                </div>
                {item.completed && <Badge variant="success" className="text-sm text-green-600 bg-green-100">Completed</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
