import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import plane from '/plane.gif';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from '../ui/alert';
import { signInWithPopup } from 'firebase/auth';
import { auth,provider } from '@/Googlesignin/config';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const user = result.user;
      const useremail=user.email;
      const photo=user.photoURL;
      localStorage.setItem("Email",useremail);
      localStorage.setItem("Photo",photo);
      console.log(photo);
      const response = await axios.post('https://ai-travelplanner-p721.onrender.com/logingoogle', {
       useremail:useremail

      });
      console.log(response.data.username);
      const username=response.data.username;
      localStorage.setItem("name",username);
      
      console.log(localStorage.getItem("name"));
   
      
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Account does not exist, please signup');
      } 
      else {
        setError('Server error, please try again later');
      }
     
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!email || !password) {
      setError('Please fill in both email and password');
    } 
    
    try {
     
      localStorage.setItem("Email",email);
      console.log(email);
      const response = await axios.post('https://ai-travelplanner-p721.onrender.com/loginvalid', {email, password});
      console.log(response.data);
      const username=response.data.username;
      localStorage.setItem("name",username)
      console.log(localStorage.getItem("name"));
      
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Account does not exist, please signup');
      } else if (err.response && err.response.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('Server error, please try again later');
      }
     
    }
  };

  return (
    <div className="min-h-screen bg-slate-200">
      <h2 className="text-4xl text-center py-10 font-mono">Travel planner</h2>
      <div className="container mx-auto">
        <div className="flex-col md:flex-row flex w-8/12 overflow-hidden rounded-xl mx-auto shadow-lg bg-white">
          <div className="md:w-1/2 justify-center">
            <img src={plane} alt="travel" className="object-cover w-full h-full" />
          </div>
          <div className="md:w-1/2 py-16 px-12 bg-indigo-100">
            <h2 className="text-3xl mb-4 text-center">Login</h2>
            
            {error && <Alert>{error}</Alert>}
            {success && <Alert>{success}</Alert>}
            
            <div className="mt-5">
              <Input
                required
                type="email"
                placeholder="Email"
                className="border border-gray-400 py-1 px-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <Input
                required
                type="password"
                placeholder="Password"
                className="border border-gray-400 py-1 px-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <Button
                className="w-full bg-blue-950 text-white py-2 text-center"
                onClick={handleSubmit}
              >
                Login
              </Button>
            </div>
            <div className="mt-5 text-center">
              <Button
                className="w-full bg-red-500 text-white py-2 text-center"
                onClick={handleGoogleSignIn}
              >
                Login with Google
              </Button>
            </div>
            <div className="mt-5 text-center">
              <p>Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
