import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import plane from '/plane.gif';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from '../ui/alert';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/Googlesignin/config';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
 
 
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const photo=user.photoURL;
      localStorage.setItem("Email",user.email);
      localStorage.setItem("Photo",photo);
      console.log(user.email);
      const response = await axios.post('https://ai-travelplanner-p721.onrender.com/user', {
        username: user.displayName,
        email: user.email,
        password: 'Sujitha@3456',
        isgoogleuser: true,
      });
  
     
      if (response.data.message === 'User already exists') {
      
        localStorage.setItem("Email",email);
        console.log(email);
        setSuccess(`Welcome back, ${user.displayName}!`);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
       
        localStorage.setItem("Email",email);
        console.log(email);
        setSuccess(`Welcome, ${user.displayName}!`);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      
      if (error.response?.data?.message === 'User already exists') {
     
        
        setSuccess('user already exists');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Google sign-up failed, please try again.');
        console.error('Google Sign-Up Error:', error);
      }
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!username || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (!validateUsername(username)) {
      setError('Username should not exceed 30 characters');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password should contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character');
      return;
    }

    try {
      const response = await axios.post('https://ai-travelplanner-p721.onrender.com/user', { username, email, password });
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  const validateUsername = (username) => username.length <= 30;

  const validatePassword = (password) => {
    const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return pwdRegex.test(password);
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
            <h2 className="text-3xl mb-4 text-center">Sign Up</h2>

            {error && <Alert color="red">{error}</Alert>}
            {success && <Alert color="green">{success}</Alert>}

            <div className="mt-5">
              <Input
                type="text"
                placeholder="Username"
                className="border border-gray-400 py-1 px-2 w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <Input
                type="email"
                placeholder="Email"
                className="border border-gray-400 py-1 px-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <Input
                type="password"
                placeholder="Password"
                className="border border-gray-400 py-1 px-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-5">
              <Button className="w-full bg-blue-950 text-white py-2 text-center" onClick={handleSubmit}>
                Sign Up
              </Button>
            </div>
            <div className="mt-5 text-center">
              <Button className="w-full bg-red-500 text-white py-2 text-center" onClick={handleGoogleSignUp}>
                Sign Up with Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
