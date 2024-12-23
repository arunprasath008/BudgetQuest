
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyDLwShj4GME7eYtpuOL9ihyZIeasa6CPN0",
  authDomain: "aiplanner-64b2b.firebaseapp.com",
  projectId: "aiplanner-64b2b",
  storageBucket: "aiplanner-64b2b.firebasestorage.app",
  messagingSenderId: "367942286157",
  appId: "1:367942286157:web:1f97ff396c8fd0925d5504",
  measurementId: "G-SPN4GS0D7H"
};



const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export { auth, provider };
