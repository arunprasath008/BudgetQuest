import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClockIcon,MoreVerticalIcon,Ticket,Clock,Share2Icon,ArrowBigLeft } from "lucide-react";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"




export default function Profile() {
  const user = {
    name: localStorage.getItem("name"),
    email: localStorage.getItem("Email"),
    avatar: localStorage.getItem("Photo"),
    role: "Traveler",
  };

  const [planHistory, setPlanHistory] = useState([]);
  const [email, setEmail] = useState(null);
  const [filter, setFilter] = useState("all");
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [profileLink, setProfileLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("Email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if (email) {
          const response = await axios.get(`https://ai-travelplanner-p721.onrender.com/${email}`);
          setPlanHistory(response.data.wishlist || []);
        } else {
          console.error("Email is not available in localStorage.");
        }
      } catch (error) {
        console.error("Error while getting profile page data:", error);
      }
    };

    fetchWishlist();
  }, [email]);

  
  useEffect(() => {
    const generateProfileLink = () => {
      setProfileLink(`https://ai-travelplanner-p721.onrender.com/${email}`);
    };
    generateProfileLink();
  }, [email]);

  const logout = () => {
    toast.success(`${user.name} logged out successfully`);
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  useEffect(() => {
    const applyFilter = () => {
      if (filter === "completed") {
        setFilteredPlans(planHistory.filter((item) => item.completed));
      } else {
        setFilteredPlans(planHistory);
      }
    };

    applyFilter();
  }, [filter, planHistory]);

  const handleDelete = async (placeName) => {
    try {
      const response = await axios.delete("https://ai-travelplanner-p721.onrender.com/delete", {
        data: { email: email, placeName: placeName },
      });

      if (response.status === 200) {
        setPlanHistory(planHistory.filter((item) => item.placeName !== placeName));
        toast.success("Successfully deleted the item", placeName);
      }
    } catch (error) {
      console.error("Error while deleting item", error);
    }
  };

  const handleComplete = async (placeName) => {
    try {
      const response = await axios.patch("https://ai-travelplanner-p721.onrender.com/complete", {
        email: email,
        placeName: placeName,
      });

      if (response.status === 200) {
        setPlanHistory(
          planHistory.map((item) =>
            item.placeName === placeName ? { ...item, completed: true } : item
          )
        );
        toast.success(`Marked ${placeName} as completed.`);
      }
    } catch (error) {
      console.error("Error while updating completion status:", error);
    }
  };
  const back=()=>{
    navigate('/');
  }


  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${user.name}'s Profile`,
          url: profileLink,
        })
        .then(() => toast.success("Profile link shared!"))
        .catch((error) => toast.error("Error sharing the link: " + error));
    } else {
     
      navigator.clipboard.writeText(profileLink);
      toast.success("Profile link copied to clipboard!");
    }
  };
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center">
  <div
    className="bg-slate-700 text-white flex items-center justify-center w-12 h-12 rounded-full shadow-md hover:bg-slate-400 hover:shadow-lg transition-all duration-300 cursor-pointer"
    onClick={back}
  >
    <ArrowBigLeft className="w-6 h-6" />
  </div>
</div>


      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-foreground h-32">
      
        </div>
        <CardHeader className="relative pb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-background absolute -top-12 sm:relative sm:top-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left mt-12 sm:mt-0 w-full">
              <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
              <CardDescription className="text-md">{user.email}</CardDescription>
              <Badge variant="outline" className="mt-2">
                {user.role}
              </Badge>
              <div className="mt-4 sm:mt-0 sm:absolute sm:right-4">
                <Button onClick={logout} className="px-11">
                  Logout
                </Button>
              </div>
              <div className="absolute top-4 right-4">
                <Button onClick={handleShare} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                  <Share2Icon className="h-5 w-5 text-primary" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <ClockIcon className="mr-2 h-6 w-6 text-primary" />
          AI Planner History
        </h2>
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
          <div className="mb-4 sm:mb-0">
            <label htmlFor="filter" className="font-semibold mr-2">
              Filter by:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((item, index) => (
            <Card
              key={index}
              className="flex flex-col overflow-visible transition-shadow hover:shadow-lg"
            >
              <CardHeader className="relative bg-primary/5 pb-4">
                <CardTitle className="mt-2">{item.placeName}</CardTitle>
                <CardDescription>{item.placeDetails}</CardDescription>
                <DropdownMenu>
                  <DropdownMenuTrigger className="absolute top-2 right-2">
                    <MoreVerticalIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="absolute z-50 bg-white shadow-lg rounded-md top-8 right-0">
                    <DropdownMenuItem onClick={() => handleComplete(item.placeName)}>
                      {item.completed ? "Completed" : "Complete"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(item.placeName)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
