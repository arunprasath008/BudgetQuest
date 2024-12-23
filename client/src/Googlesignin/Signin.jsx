import React, { useEffect, useState } from 'react'
import{auth,provider}from "./config"
import {signInWithPopup}from "firebase/auth"
import { Button } from '@/components/ui/button'
import CreateTrip from '../create-trip/index'
function Signin() {
    const[value,setValue]=useState('')
    const handleClick=()=>{
        signInWithPopup(auth,provider).then((data)=>{
            setValue(data.user.email)
            localStorage.setItem("email",data.user.email)
        }).catch((e)=>{
          console.log("signin with pop google error",e);
        })
    }
    useEffect(() => {
        setValue(localStorage.getItem('email'));
    }, []);
  return (
    <div>
        {value ? (
      <CreateTrip/>
    ) : (
      <Button onClick={handleClick}>Signin with Google</Button>
    )}
    </div>
  );
}

export default Signin





// import React, { useEffect, useState } from 'react';
// import { auth, provider } from './config';
// import { signInWithPopup } from 'firebase/auth';
// import { Button } from '@/components/ui/button';
// import CreateTrip from '@/create-trip';

// function Signin() {
//   const [value, setValue] = useState('');
//   const [isSigningIn, setIsSigningIn] = useState(false); // Manage loading state

//   const handleClick = async () => {
//     if (isSigningIn) return; // Prevent multiple sign-in attempts

//     setIsSigningIn(true);
//     try {
//       const data = await signInWithPopup(auth, provider);
//       setValue(data.user.email);
//       localStorage.setItem('email', data.user.email);
//     } catch (error) {
//       if (error.code === 'auth/cancelled-popup-request') {
//         console.log('Popup was closed before completion.');
//       } else {
//         console.error('Error signing in:', error.message);
//       }
//     } finally {
//       setIsSigningIn(false); // Reset the loading state
//     }
//   };

//   useEffect(() => {
//     setValue(localStorage.getItem('email'));
//   }, []);

//   return (
//     <div>
//       {value ? (
//         <CreateTrip />
//       ) : (
//         <Button onClick={handleClick} disabled={isSigningIn}>
//           {isSigningIn ? 'Signing in...' : 'Signin with Google'}
//         </Button>
//       )}
//     </div>
//   );
// }

// export default Signin;
