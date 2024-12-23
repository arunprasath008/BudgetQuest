import { useDispatch } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Wallet, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from '@/components/ui/slider';
import { setTravelPlan } from '@/store/Travelplanslice';
import { useNavigate } from 'react-router-dom';

const formSteps = [
  
  { id: 'destination', title: 'Destination', icon: MapPin },
  { id: 'days', title: 'Duration', icon: Calendar },
  { id: 'budget', title: 'Budget', icon: Wallet },
  { id: 'travelerType', title: 'Travelers', icon: Users },
];

export default function CreateTrip() {
  // const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    
    destination: '',
    days: undefined, 
    budget: '', 
    travelerType: '', 
  });
 
  const [query, setQuery] = useState(''); // User input for destination
 
  const [suggestions, setSuggestions] = useState([]); // Store suggestions
  const[loading,setLoading]=useState(false);
  const [error, setError] = useState('');
const navigate=useNavigate();
  
  
  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.gomaps.pro/maps/api/place/queryautocomplete/json`,
        {
          params: {
            input,
            key: 'AlzaSy2eEOPaRtD4aBYY43a43d-vT83n4fAmUQF', 
          },
        }
      );
      setSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setSuggestions([]);
    }
  };
 

  //  form's next button click
  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  //  form's back button 
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  
  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.destination || !formData.days || !formData.budget || !formData.travelerType) {
      setError('Please fill in all fields before generating the plan.');
      return; 
    }
    if(loading)return;
    setLoading(true);
    try {
     
      const payload = {
        query: formData.destination,
        days: formData.days,
        budget: formData.budget,
        people: formData.travelerType,
      };

  
      const response = await axios.post('https://ai-travelplanner-p721.onrender.com/gemini', payload);

      console.log('API Response:', response.data);
      
      localStorage.setItem("TripData", response.data);
      
      // console.log('Stored TripData in localStorage:', localStorage.getItem("TripData"));

    
      
      
      // dispatch(setTravelPlan(response.data));
      navigate('/view');
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error generating travel plan:', error);
      setError('Failed to generate travel plan. Please try again.');
    }
    finally{
      setLoading(false);
    }
  };

  // Handle user input change for destination
  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setQuery(userInput);
    fetchSuggestions(userInput); // Fetch suggestions based on input
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setQuery(suggestion.description);
    setSuggestions([]); // Clear suggestions after selection
    updateFormData('destination', suggestion.description); // Update form data with selected suggestion
  };

  // Render the current step of the form
  const renderStep = () => {
    switch (formSteps[currentStep].id) {
     
      case 'destination':
        return (
          <div className="space-y-4">
            <Label htmlFor="destination" className="text-2xl font-semibold flex items-center text-primary">
              <MapPin className="h-8 w-8 mr-2 text-primary" />
              Where's your dream destination?
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Paris, Tokyo, New York"
              value={query}
              onChange={handleInputChange}
              className="text-lg p-6 rounded-xl border-2 border-primary/20 focus:border-primary transition-all duration-300"
              required
            />
            {suggestions.length > 0 && (
              <ul className="border mt-2 bg-white rounded shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'days':
        return (
          <div className="space-y-6">
            <Label htmlFor="days" className="text-2xl font-semibold flex items-center text-primary">
              <Calendar className="h-8 w-8 mr-2 text-primary" />
              How long is your adventure?
            </Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="days"
                min={0}
                max={10} 
                step={1} 
                value={[formData.days || 1]}
                onValueChange={(value) => updateFormData('days', value[0])}
                className="flex-grow"
              />
              <span className="text-4xl font-bold w-20 text-center text-primary">
                {formData.days || 1}
              </span>
            </div>
            <p className="text-lg text-muted-foreground text-center">
              {formData.days === 1 ? 'day' : 'days'}
            </p>
          </div>
        );
      case 'budget':
        return (
          <div className="space-y-6">
            <Label htmlFor="budget" className="text-2xl font-semibold flex items-center text-primary">
              <Wallet className="h-8 w-8 mr-2 text-primary" />
              What's your budget for this trip?
            </Label>
            <RadioGroup
              value={formData.budget}
              onValueChange={(value) => updateFormData('budget', value)}
              className="grid grid-cols-1 gap-4"
            >
              {['Affordable(<15k)', 'Reasonable(<50k)', 'Premium(>50k)'].map((budgetOption) => (
                <div key={budgetOption} className="relative">
                  <RadioGroupItem value={budgetOption} id={budgetOption} className="peer sr-only" />
                  <Label
                    htmlFor={budgetOption}
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    <span className="capitalize text-xl">{budgetOption}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 'travelerType':
        return (
          <div className="space-y-6">
            <Label className="text-2xl font-semibold flex items-center text-primary">
              <Users className="h-8 w-8 mr-2 text-primary" />
              Who's joining your journey?
            </Label>
            <RadioGroup
              value={formData.travelerType}
              onValueChange={(value) => updateFormData('travelerType', value)}
              className="grid grid-cols-2 gap-4"
            >
              {['solo', 'couple', 'family', 'friends'].map((type) => (
                <div key={type} className="relative">
                  <RadioGroupItem value={type} id={type} className="peer sr-only" />
                  <Label
                    htmlFor={type}
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                  >
                    <span className="capitalize text-xl">{type}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-200 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-xl space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">{formSteps[currentStep].title}</h2>
          <p className="text-gray-500">{currentStep + 1}/{formSteps.length}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              disabled={currentStep === 0}
              onClick={handleBack}
              variant="secondary"
             
            >
              Back
            </Button>
            {currentStep < formSteps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
               
              >
                Next
              </Button>
            ) : (
              <Button type="submit"  disabled={loading}>
                 {loading ? 'Generating...' : 'Generate Plan'}
              </Button>
            )}
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}
       
      
      </motion.div>
    </div>
  );
}









