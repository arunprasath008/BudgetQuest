import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, DollarSign, MapPin, Plane, Users } from 'lucide-react';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import world from '/world.gif';
export default function Hero() {
  const [login, setLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("Email");
    setLogin(!email);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Plane className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">BUDGET QUEST</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#home" className="text-gray-500 hover:text-gray-900">Home</a>
            <a href="#features" className="text-gray-500 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-gray-500 hover:text-gray-900">How It Works</a>
            {login ? (
              <Link to={'/login'}>
                <Button>Signup/Login</Button>
              </Link>
            ) : (
              <Link to={'/profile'}>
                <Button>Profile</Button>
              </Link>
            )}
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <a href="#home" className="block px-4 py-2 text-gray-500 hover:text-gray-900">Home</a>
            <a href="#features" className="block px-4 py-2 text-gray-500 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="block px-4 py-2 text-gray-500 hover:text-gray-900">How It Works</a>
            {login ? (
              <Link to={'/login'}>
                <Button className="w-full mt-2">Signup/Login</Button>
              </Link>
            ) : (
              <Link to={'/profile'}>
                <Button className="w-full mt-2">Profile</Button>
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow">
        <section id="home" className="bg-gradient-to-r from-purple-800 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-32">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Your AI-Powered Travel Companion
                </h1>
                <p className="mt-6 text-lg sm:text-xl">
                  Plan your perfect trip in minutes. Tailored itineraries for any destination, budget, and travel style.
                </p>
                <div className="mt-10">
                  {login ? (
                    <Link to={'/login'}>
                      <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-50">
                        Get Started for Free
                      </Button>
                    </Link>
                  ) : (
                    <Link to={'/create-trip'}>
                      <Button size="lg" className="px-8 py-3 text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-50">
                        Get Started for Free
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <img
                  src={world}
                  alt="AI Travel Planner Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center">Plan Smarter, Travel Better</h2>
            <p className="mt-4 text-xl text-center text-gray-500">
              Our AI-powered platform revolutionizes the way you plan your trips.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: MapPin, title: 'Smart Recommendations', description: 'Get personalized suggestions based on your preferences.' },
                { icon: Calendar, title: 'Time-Saving', description: 'Create full itineraries in minutes, not hours.' },
                { icon: DollarSign, title: 'Budget-Friendly', description: 'Find the best experiences within your price range.' },
                { icon: Users, title: 'Group-Oriented', description: 'Plan for solo trips, couples, families, or friend groups.' },
              ].map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <feature.icon className="h-10 w-10 text-indigo-600 mb-4" />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="how-it-works" className="py-12 md:py-24 lg:py-32">
          <div className="container px-6 md:px-6 lg:px-8">
            <h2 className="text-3xl font-bold sm:text-5xl text-center mb-12 ml-28">
              How It Works
            </h2>
            <div className="grid gap-10 lg:grid-cols-5 ml-28">
              {[ 
                { step: 1, title: "Choose Destination", description: "Enter your dream destination." },
                { step: 2, title: "Set Duration", description: "Specify the number of days for your trip." },
                { step: 3, title: "Define Budget", description: "Input your travel budget." },
                { step: 4, title: "Select Traveler Type", description: "Choose from solo, couple, family, or friends." },
                { step: 5, title: "Get Your Plan", description: "Receive a personalized itinerary instantly." }
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-gray-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="get-started" className="bg-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to plan your next adventure?
            </h2>
            <p className="mt-4 text-xl">
              Start your AI-powered travel planning experience today.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
              
                    <Button
                      size="lg"
                      className="px-8 py-3 text-lg font-semibold bg-white text-indigo-600 hover:bg-gray-50"
                    >
                     Want a sneak peek? Watch the demo!
                    </Button>
               
              
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2023 AI Travel Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
