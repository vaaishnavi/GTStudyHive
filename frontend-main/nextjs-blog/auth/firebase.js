import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBq-1_2nKg6cuIDM2DaKjjsryar6lzdexQ",
  authDomain: "studyhiveauth.firebaseapp.com",
  projectId: "studyhiveauth",
  storageBucket: "studyhiveauth.appspot.com",
  messagingSenderId: "404852672633",
  appId: "1:404852672633:web:8d4d1e6f9d2ce3d8d7aca8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default { app, auth };