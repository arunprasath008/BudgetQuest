import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import CreateTrip from './create-trip'
import { Toaster } from './components/ui/sonner'

import Headers from './components/custom/Header'

import Login from './components/custom/Login'
import Signup from './components/custom/Signup'

import View from './TripDetails/View'

import Profile from './components/custom/Profile'
import SharableProfile from './components/custom/SharableProfile'

const router=createBrowserRouter([{
path:'/',
element:<App/>
},
{
  path:'/create-trip',
  element:<CreateTrip/>
},
{
  path:'/login',
  element:<Login/>
},
{
  path:'/signup',
  element:<Signup/>
},
{
  path:'/view',
  element:<View />
},
{
  path:'/profile',
  element:<Profile/>
},
{
  path: "/profile/:email",
  element:<SharableProfile/>
}
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router}>
   
    <Headers/>
     <Toaster /> 
     
    </RouterProvider>
    
  </StrictMode>
)
